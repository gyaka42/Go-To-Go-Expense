import { firestore } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const COLLECTION_NAME = "userEmailDirectory";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function emailToDocId(email: string): string {
  return encodeURIComponent(email);
}

export async function saveEmailDirectoryEntry(
  uid: string,
  email: string | null | undefined
): Promise<void> {
  if (!uid || !email) {
    return;
  }

  const normalized = normalizeEmail(email);
  const ref = doc(firestore, COLLECTION_NAME, emailToDocId(normalized));

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

  const ref = doc(firestore, COLLECTION_NAME, emailToDocId(normalized));
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as { uid?: string | null };
  return data.uid ?? null;
}

export { normalizeEmail };
