import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/core/lib/firebase-utils";
import { Recording, Transcription } from "@/types";

export const useRecording = ({ recordingId }: { recordingId: string }) => {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [transcription, setTranscription] = useState<Transcription | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setRecording(null);
        return;
      }

      setLoading(false);

      const q = doc(db, "audio-recordings", recordingId);

      unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.exists()) {
          setRecording(null);
          return;
        }

        setRecording(querySnapshot.data() as Recording);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user || !recording?.transcriptionId) {
        setTranscription(null);
        return;
      }

      const q = doc(db, "transcriptions", recording?.transcriptionId);

      unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.exists()) {
          setTranscription(null);
          return;
        }

        setTranscription(querySnapshot.data() as Transcription);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [recording]);

  return { recording, loading, transcription };
};
