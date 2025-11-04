import { firestore } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const COLLECTION_NAME = "emailDirectory";

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
  const ref = doc(firestore, COLLECTION_NAME, normalized);

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

  const directoryRef = doc(firestore, COLLECTION_NAME, normalized);
  const snapshot = await getDoc(directoryRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as { uid?: string | null };
  return data.uid ?? snapshot.id ?? null;
}

export { normalizeEmail };
