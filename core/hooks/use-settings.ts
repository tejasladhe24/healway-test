import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/core/lib/firebase-utils";
import { Settings } from "@/types";

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    enableLiveTranscription: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "settings", user.uid); // Direct document reference

      unsubscribeFirestore = onSnapshot(
        docRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setSettings(docSnapshot.data() as Settings);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching settings: ", error);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  return { settings, loading };
};
