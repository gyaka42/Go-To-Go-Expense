import { lookupUidByEmail } from "@/services/emailDirectory";
import { auth, db } from "@/services/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { Activity, NewTxn, Transaction, Wallet } from "./types";

const LARGE_TRANSACTION_THRESHOLD = 1000;

const activityCollection = (walletId: string) =>
  collection(db, "wallets", walletId, "activity");

const transactionsCollection = (walletId: string) =>
  collection(db, "wallets", walletId, "transactions");

function currentUserId(): string | undefined {
  return auth.currentUser?.uid ?? undefined;
}

function asTimestamp(value: Date | Timestamp): Timestamp {
  return value instanceof Timestamp ? value : Timestamp.fromDate(value);
}

function normalizeTimestamp(value: unknown): Timestamp {
  if (value instanceof Timestamp) return value;
  if (value instanceof Date) return Timestamp.fromDate(value);
  if (typeof value === "number") return Timestamp.fromMillis(value);
  return Timestamp.fromDate(new Date());
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  const next: Record<string, unknown> = {};
  Object.entries(value).forEach(([key, val]) => {
    if (val !== undefined) {
      next[key] = val;
    }
  });
  return next as T;
}

function toWalletFromFirestore(
  id: string,
  data: Partial<Wallet> & { uid?: string; created?: Date | Timestamp | number }
): Wallet {
  const ownerIds = Array.isArray(data.ownerIds)
    ? data.ownerIds
    : data.uid
    ? [data.uid]
    : [];
  const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];
  const participants = Array.isArray(data.participantIds)
    ? data.participantIds
    : Array.from(new Set([...ownerIds, ...memberIds]));

  const createdAtValue =
    (data as any).createdAt ?? data.created ?? Timestamp.fromDate(new Date());

  return {
    id,
    name: data.name ?? "",
    currency: data.currency ?? "EUR",
    isPrivate: Boolean(data.isPrivate),
    ownerIds,
    memberIds,
    participantIds: participants,
    createdAt: normalizeTimestamp(createdAtValue),
  };
}

async function loadWallet(walletId: string): Promise<Wallet> {
  const walletRef = doc(db, "wallets", walletId);
  const snapshot = await getDoc(walletRef);
  if (!snapshot.exists()) {
    throw new Error("Wallet niet gevonden");
  }
  const data = snapshot.data() as Partial<Wallet> & {
    uid?: string;
    created?: Date | Timestamp | number;
  };
  const ownerIds = Array.isArray(data.ownerIds)
    ? data.ownerIds
    : data.uid
    ? [data.uid]
    : [];
  const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];
  const participants = Array.isArray(data.participantIds)
    ? data.participantIds
    : Array.from(new Set([...ownerIds, ...memberIds]));

  const createdAtValue =
    data.createdAt ?? data.created ?? Timestamp.fromDate(new Date());

  return {
    id: snapshot.id,
    name: data.name ?? "",
    currency: data.currency ?? "EUR",
    isPrivate: Boolean(data.isPrivate),
    ownerIds,
    memberIds,
    participantIds: participants,
    createdAt: normalizeTimestamp(createdAtValue),
  };
}

async function resolveUserIdByEmail(email: string): Promise<string> {
  const uid = await lookupUidByEmail(email);
  if (!uid) {
    throw new Error("Geen gebruiker gevonden voor dit e-mailadres");
  }
  return uid;
}

function queueActivity(
  batch: ReturnType<typeof writeBatch>,
  walletId: string,
  activity: Omit<Activity, "id" | "ts">
) {
  const activityRef = doc(activityCollection(walletId));
  batch.set(activityRef, {
    ...activity,
    ts: serverTimestamp(),
  });
}

/**
 * Real‑time listener for all wallets visible to a user.
 * Merges results from multiple queries (owner, member, participant, legacy uid).
 * No composite index required; sorting happens client‑side.
 */
export function listenUserWallets(
  userId: string,
  cb: (wallets: Wallet[]) => void
): Unsubscribe {
  const walletsCol = collection(db, "wallets");

  const queriesToListen = [
    query(walletsCol, where("uid", "==", userId)),
    query(walletsCol, where("ownerIds", "array-contains", userId)),
    query(walletsCol, where("memberIds", "array-contains", userId)),
    query(walletsCol, where("participantIds", "array-contains", userId)),
  ];

  const state = new Map<string, Wallet>();
  const unsubs = queriesToListen.map((qry) =>
    onSnapshot(qry, (snap) => {
      snap.docChanges().forEach((change) => {
        const id = change.doc.id;
        if (change.type === "removed") {
          state.delete(id);
        } else {
          const data = change.doc.data() as Partial<Wallet> & {
            uid?: string;
            created?: Date | Timestamp | number;
          };
          state.set(id, toWalletFromFirestore(id, data));
        }
      });

      const list = Array.from(state.values()).sort(
        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
      );
      cb(list);
    })
  );

  return () => unsubs.forEach((u) => u());
}

/**
 * One‑off fetch for all wallets visible to a user (same merge logic as above).
 */
export async function getUserWallets(userId: string): Promise<Wallet[]> {
  const walletsCol = collection(db, "wallets");

  const queriesToFetch = [
    query(walletsCol, where("uid", "==", userId)),
    query(walletsCol, where("ownerIds", "array-contains", userId)),
    query(walletsCol, where("memberIds", "array-contains", userId)),
    query(walletsCol, where("participantIds", "array-contains", userId)),
  ];

  const map = new Map<string, Wallet>();
  for (const qy of queriesToFetch) {
    const snap = await getDocs(qy);
    snap.forEach((docSnap) => {
      const data = docSnap.data() as Partial<Wallet> & {
        uid?: string;
        created?: Date | Timestamp | number;
      };
      map.set(docSnap.id, toWalletFromFirestore(docSnap.id, data));
    });
  }

  return Array.from(map.values()).sort(
    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
  );
}

export async function inviteMember(
  walletId: string,
  email: string
): Promise<void> {
  const wallet = await loadWallet(walletId);
  const userId = await resolveUserIdByEmail(email);

  if (wallet.ownerIds.includes(userId) || wallet.memberIds.includes(userId)) {
    throw new Error("Gebruiker is al lid van deze wallet");
  }

  const currentUser = currentUserId();
  if (!currentUser || !wallet.ownerIds.includes(currentUser)) {
    throw new Error("Alleen de eigenaar kan leden uitnodigen");
  }

  const walletRef = doc(db, "wallets", walletId);
  const batch = writeBatch(db);
  batch.update(walletRef, {
    memberIds: arrayUnion(userId),
    participantIds: arrayUnion(userId),
  });
  queueActivity(batch, walletId, {
    type: "member_invited",
    actorId: currentUser,
    targetId: userId,
    message: `Uitnodiging verstuurd naar ${email}`,
  });
  await batch.commit();
}

export async function addTransaction(
  walletId: string,
  txn: NewTxn
): Promise<string> {
  const wallet = await loadWallet(walletId);
  const ref = doc(transactionsCollection(walletId));
  const isOwner = wallet.ownerIds.includes(txn.createdBy);
  const isParticipant =
    wallet.ownerIds.includes(txn.createdBy) ||
    wallet.memberIds.includes(txn.createdBy) ||
    (wallet.participantIds ?? []).includes(txn.createdBy);
  if (!isParticipant) {
    throw new Error("Gebruiker is geen lid van deze wallet");
  }
  const status = isOwner ? "approved" : "pending";
  const now = serverTimestamp();
  const payload = omitUndefined({
    amount: txn.amount,
    type: txn.type,
    categoryId: txn.categoryId,
    description: txn.description,
    date: asTimestamp(txn.date),
    createdBy: txn.createdBy,
    status,
    approvedBy: isOwner ? txn.createdBy : undefined,
    approvedAt: isOwner ? now : undefined,
    createdAt: now,
  });

  const batch = writeBatch(db);
  batch.set(ref, payload);
  queueActivity(batch, walletId, {
    type: "transaction_created",
    actorId: txn.createdBy,
    targetId: ref.id,
    message:
      status === "approved"
        ? "Transactie aangemaakt en goedgekeurd"
        : "Nieuwe transactie wacht op goedkeuring",
  });

  if (status === "approved") {
    queueActivity(batch, walletId, {
      type: "transaction_approved",
      actorId: txn.createdBy,
      targetId: ref.id,
      message: "Transactie automatisch goedgekeurd",
    });
  }

  if (Math.abs(txn.amount) >= LARGE_TRANSACTION_THRESHOLD) {
    queueActivity(batch, walletId, {
      type: "transaction_large",
      actorId: txn.createdBy,
      targetId: ref.id,
      message: `Grote transactie: ${txn.amount} ${wallet.currency}`,
    });
  }

  await batch.commit();

  return ref.id;
}

export async function approveTransaction(
  walletId: string,
  txnId: string,
  approverId: string
): Promise<void> {
  const wallet = await loadWallet(walletId);
  if (!wallet.ownerIds.includes(approverId)) {
    throw new Error("Alleen de eigenaar kan transacties goedkeuren");
  }
  const transactionRef = doc(db, "wallets", walletId, "transactions", txnId);
  const currentSnap = await getDoc(transactionRef);
  if (!currentSnap.exists()) {
    throw new Error("Transactie niet gevonden");
  }
  const currentData = currentSnap.data() as Partial<Transaction>;
  if (currentData.status && currentData.status !== "pending") {
    throw new Error("Transactie is al verwerkt");
  }
  const batch = writeBatch(db);
  batch.update(transactionRef, {
    status: "approved",
    approvedBy: approverId,
    approvedAt: serverTimestamp(),
  });
  queueActivity(batch, walletId, {
    type: "transaction_approved",
    actorId: approverId,
    targetId: txnId,
    message: "Transactie goedgekeurd",
  });
  await batch.commit();
}

export async function rejectTransaction(
  walletId: string,
  txnId: string,
  approverId: string
): Promise<void> {
  const wallet = await loadWallet(walletId);
  if (!wallet.ownerIds.includes(approverId)) {
    throw new Error("Alleen de eigenaar kan transacties afwijzen");
  }
  const transactionRef = doc(db, "wallets", walletId, "transactions", txnId);
  const currentSnap = await getDoc(transactionRef);
  if (!currentSnap.exists()) {
    throw new Error("Transactie niet gevonden");
  }
  const currentData = currentSnap.data() as Partial<Transaction>;
  if (currentData.status && currentData.status !== "pending") {
    throw new Error("Transactie is al verwerkt");
  }
  const batch = writeBatch(db);
  batch.update(transactionRef, {
    status: "rejected",
    approvedBy: approverId,
    approvedAt: serverTimestamp(),
  });
  queueActivity(batch, walletId, {
    type: "transaction_rejected",
    actorId: approverId,
    targetId: txnId,
    message: "Transactie afgewezen",
  });
  await batch.commit();
}

export function listenWallet(
  walletId: string,
  cb: (wallet: Wallet) => void
): Unsubscribe {
  const walletRef = doc(db, "wallets", walletId);
  return onSnapshot(walletRef, (snapshot) => {
    if (!snapshot.exists()) return;
    const data = snapshot.data() as Omit<Wallet, "id">;
    cb({ ...data, id: snapshot.id });
  });
}

export function listenTransactions(
  walletId: string,
  cb: (txns: Transaction[]) => void
): Unsubscribe {
  const q = query(transactionsCollection(walletId), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Transaction, "id">;
      return { ...data, id: docSnap.id };
    });
    cb(items);
  });
}

export function listenActivity(
  walletId: string,
  cb: (events: Activity[]) => void
): Unsubscribe {
  const q = query(activityCollection(walletId), orderBy("ts", "desc"));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Activity, "id">;
      return { ...data, id: docSnap.id };
    });
    cb(events);
  });
}
