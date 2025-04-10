import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/core/lib/firebase-utils";
import { Recording } from "@/types";
import { useAuth } from "../provider/session-provider";

const PAGE_SIZE = 10;

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setRecordings([]);
        return;
      }

      setLoading(false);

      const q = query(
        collection(db, "audio-recordings"),
        where("userId", "==", user.uid)
      );

      unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          setHasMore(false);
          return;
        }

        const userRecordings = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Recording),
        }));

        setRecordings(userRecordings);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]); // Store last doc for pagination
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const loadMore = async () => {
    if (!lastDoc || !user) return;

    setLoading(true);

    const nextQuery = query(
      collection(db, "audio-recordings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );

    const nextSnapshot = await getDocs(nextQuery);

    if (!nextSnapshot.empty) {
      setHasMore(true);
      setLoading(false);
      return;
    }

    setRecordings((prev) => [
      ...prev,
      ...nextSnapshot.docs.map((doc) => ({
        ...(doc.data() as Recording),
      })),
    ]);

    setLastDoc(nextSnapshot.docs[nextSnapshot.docs.length - 1]);
    setLoading(false);
  };

  return { recordings, loading, loadMore, hasMore };
};
