import { auth, firestore } from "@/config/firebase";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type UseFetchOptions = {
  /**
   * When false, the hook will skip subscribing and reset local state.
   */
  enabled?: boolean;
  /**
   * When true (default) the hook waits until an authenticated Firebase user exists.
   */
  requireAuth?: boolean;
  /**
   * Skip subscribing if the constraints array is empty/undefined (default true).
   */
  skipIfEmptyConstraints?: boolean;
};

// Generic Firestore listener hook that (re)subscribes when deps change
// and guards against building queries with incomplete constraints (e.g. uid undefined)
const useFetchData = <T>(
  collectionPath: string,
  constraints?: QueryConstraint[],
  deps: any[] = [], // pass relevant deps here (e.g. [user?.uid])
  options?: UseFetchOptions
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    enabled = true,
    requireAuth = true,
    skipIfEmptyConstraints = true,
  } = options ?? {};

  useEffect(() => {
    if (!collectionPath) return;

    // If constraints aren't ready yet (e.g., no uid), don't subscribe yet
    const resetState = () => {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    };

    if (!enabled) {
      resetState();
      return;
    }

    if (requireAuth && !auth.currentUser) {
      resetState();
      return;
    }

    // If constraints aren't ready yet (e.g., no uid), don't subscribe yet
    if (skipIfEmptyConstraints && (!constraints || constraints.length === 0)) {
      resetState();
      return;
    }

    setLoading(true);
    setError(null);

    let unsub = () => {};
    try {
      const ref = collection(firestore, collectionPath);
      const shouldApplyConstraints =
        Array.isArray(constraints) && constraints.length > 0;
      const q = shouldApplyConstraints ? query(ref, ...constraints) : ref;

      unsub = onSnapshot(
        q,
        (snapshot) => {
          const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          setData(fetched);
          setLoading(false);
        },
        (err) => {
          console.log(`Error fetching ${collectionPath}`, err);
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (e: any) {
      // Catch synchronous query build errors (e.g., where value undefined)
      console.log("Query build error", e);
      setError(e?.message || "Query error");
      setLoading(false);
      return;
    }

    return () => {
      try {
        unsub();
      } catch {}
    };
  }, [collectionPath, enabled, requireAuth, skipIfEmptyConstraints, ...deps]);

  return { data, loading, error };
};

export default useFetchData;
