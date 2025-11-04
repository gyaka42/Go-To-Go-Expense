import { lookupUidByEmail } from "@/services/emailDirectory";
import { auth, db } from "@/services/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { Activity, NewTxn, Transaction, Wallet } from "./types";

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

async function logActivity(
  walletId: string,
  activity: Omit<Activity, "id" | "ts">
) {
  await addDoc(activityCollection(walletId), {
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

  const walletRef = doc(db, "wallets", walletId);
  await updateDoc(walletRef, {
    memberIds: arrayUnion(userId),
    participantIds: arrayUnion(userId),
  });

  await logActivity(walletId, {
    type: "member_invited",
    actorId: currentUserId() ?? "system",
    targetId: userId,
    message: `Uitnodiging verstuurd naar ${email}`,
  });
}

export async function addTransaction(
  walletId: string,
  txn: NewTxn
): Promise<string> {
  const wallet = await loadWallet(walletId);
  const ref = doc(transactionsCollection(walletId));
  const isOwner = wallet.ownerIds.includes(txn.createdBy);
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

  await setDoc(ref, payload);

  await logActivity(walletId, {
    type: "transaction_created",
    actorId: txn.createdBy,
    targetId: ref.id,
    message:
      status === "approved"
        ? "Transactie aangemaakt en goedgekeurd"
        : "Nieuwe transactie wacht op goedkeuring",
  });

  if (status === "approved") {
    await logActivity(walletId, {
      type: "transaction_approved",
      actorId: txn.createdBy,
      targetId: ref.id,
      message: "Transactie automatisch goedgekeurd",
    });
  }

  return ref.id;
}

export async function approveTransaction(
  walletId: string,
  txnId: string,
  approverId: string
): Promise<void> {
  const transactionRef = doc(db, "wallets", walletId, "transactions", txnId);
  await updateDoc(transactionRef, {
    status: "approved",
    approvedBy: approverId,
    approvedAt: serverTimestamp(),
  });

  await logActivity(walletId, {
    type: "transaction_approved",
    actorId: approverId,
    targetId: txnId,
    message: "Transactie goedgekeurd",
  });
}

export async function rejectTransaction(
  walletId: string,
  txnId: string,
  approverId: string
): Promise<void> {
  const transactionRef = doc(db, "wallets", walletId, "transactions", txnId);
  await updateDoc(transactionRef, {
    status: "rejected",
    approvedBy: approverId,
    approvedAt: serverTimestamp(),
  });

  await logActivity(walletId, {
    type: "transaction_rejected",
    actorId: approverId,
    targetId: txnId,
    message: "Transactie afgewezen",
  });
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
