import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/core/lib/firebase-utils";
import { Recording } from "@/types";

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setRecordings([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "audio-recordings"),
        where("userId", "==", user.uid)
      );

      unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const userRecordings = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Recording),
        }));

        setRecordings(userRecordings);
        setLoading(false);
      });
    });

    // Cleanup both Firestore and Auth listeners
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  return { recordings, loading };
};
