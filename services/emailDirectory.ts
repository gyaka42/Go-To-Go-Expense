import { firestore } from "@/config/firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "userEmailDirectory";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function saveEmailDirectoryEntry(
  uid: string,
  email: string | null | undefined
): Promise<void> {
  if (!uid || !email) {
    return;
  }

  const normalized = normalizeEmail(email);
  const ref = doc(firestore, COLLECTION_NAME, uid);

  await setDoc(
    ref,
    {
      uid,
      email: normalized,
    },
    { merge: true }
  );
}

export async function lookupUidByEmail(email: string): Promise<string | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return null;
  }

  const directoryRef = collection(firestore, COLLECTION_NAME);
  const searchQuery = query(
    directoryRef,
    where("email", "==", normalized),
    limit(1)
  );
  const snapshot = await getDocs(searchQuery);

  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];
  const data = docSnap.data() as { uid?: string | null };
  return data.uid ?? docSnap.id ?? null;
}

export { normalizeEmail };
