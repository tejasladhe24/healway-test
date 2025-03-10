"use client";

import { ElevenLabsClient } from "elevenlabs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-utils";
import { Recording } from "@/types";
import { getBlobFromUrl } from "./utils";

const client = new ElevenLabsClient({
  apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
});

export const transcribe = async (recordingId: string) => {
  const docRef = doc(db, "audio-recordings", recordingId);

  const recording = await getDoc(docRef);

  const recordingData = recording.data();

  if (!recording.exists()) {
    throw new Error("Recording not found");
  }

  const { url } = recordingData as Recording;

  const blob = await getBlobFromUrl(url);

  const audioBlob = new Blob([blob], { type: "audio/webm" });

  return await client.speechToText.convert({
    file: audioBlob,
    model_id: "scribe_v1",
  });
};
