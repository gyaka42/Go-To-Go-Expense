import { firestore } from "@/config/firebase";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useState } from "react";

// Generic Firestore listener hook that (re)subscribes when deps change
// and guards against building queries with incomplete constraints (e.g. uid undefined)
const useFetchData = <T>(
  collectionPath: string,
  constraints: QueryConstraint[] = [],
  deps: any[] = [] // pass relevant deps here (e.g. [user?.uid])
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionPath) return;

    // If constraints aren't ready yet (e.g., no uid), don't subscribe yet
    if (!constraints || constraints.length === 0) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    let unsub = () => {};
    try {
      const ref = collection(firestore, collectionPath);
      const q = query(ref, ...constraints);

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
          console.log("Error fetching data", err);
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
  }, [collectionPath, ...deps]);

  return { data, loading, error };
};

export default useFetchData;
