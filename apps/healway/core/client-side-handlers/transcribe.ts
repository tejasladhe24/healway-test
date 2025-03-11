"use client";

import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { transcribe } from "../lib/transcribe";
import { db } from "../lib/firebase-utils";
import { toast } from "sonner";
import { User } from "firebase/auth";

export const transcribeAudio = async (
  recordingId: string,
  user: User | null
) => {
  if (!user) {
    return toast.error("You must be logged in to transcribe a recording?.");
  }

  let data;

  try {
    const { words, ...rest } = await transcribe(recordingId);
    data = { userId: user.uid, recordingId, ...rest };

    const collectionRef = collection(db, "transcriptions");
    const newTranscript = await addDoc(collectionRef, data);

    const recordingRef = doc(db, "audio-recordings", recordingId);
    await updateDoc(recordingRef, { transcriptionId: newTranscript.id });
    toast.info(`Transcription created for ${recordingId}`);
  } catch (error) {
    console.error("Error transcribing audio:", error);
    toast.error("Failed to transcribe audio");
    return;
  }
};
