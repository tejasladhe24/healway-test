"use client";

import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { transcribe } from "../lib/transcribe";
import { auth, db } from "../lib/firebase-utils";
import { toast } from "sonner";
import { Recording, Transcription } from "@/types";

export const transcribeAudio = async (recordingId: string) => {
  if (!auth.currentUser) {
    return toast.error("You must be logged in to transcribe a recording?.");
  }

  let data;

  try {
    const { words, ...rest } = await transcribe(recordingId);
    data = { userId: auth.currentUser.uid, recordingId, ...rest };

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

export const openTranscription = async (recording: Recording) => {
  if (!auth.currentUser) {
    return toast.error("You must be logged in to transcribe a recording?.");
  }
  if (!recording?.transcriptionId) {
    return toast.error("You must transcribe the recording first.");
  }

  const transcriptionDocRef = doc(
    db,
    "transcriptions",
    recording?.transcriptionId
  );

  const transcription = await getDoc(transcriptionDocRef);

  if (!transcription.exists()) {
    toast.warning("Transcription not found");
    return;
  }
  const data = transcription.data() as Transcription;
  toast.info(data.text);
  return;
};
