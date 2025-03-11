"use client";

import { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { storage, db } from "@/core/lib/firebase-utils";
import { Recording } from "@/types";
import { useAuth } from "../provider/session-provider";

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const { user } = useAuth();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const fileRef = ref(storage, `recordings/${Date.now()}.webm`);

        const duration = startTimeRef.current
          ? (Date.now() - startTimeRef.current) / 1000
          : 0; // Duration in seconds
        const recordingId = `${user?.uid}-${Date.now()}`;

        // Upload to Firebase Storage
        await uploadBytes(fileRef, audioBlob);
        const url = await getDownloadURL(fileRef);

        const newRecording: Omit<Recording, "userId"> = {
          id: recordingId,
          url,
          title: `Recording ${recordingId}`,
          duration,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Store URL in Firestore
        await setDoc(doc(db, "audio-recordings", recordingId), {
          ...newRecording,
          userId: user?.uid, // Store user ID for ownership tracking
          createdAt: Timestamp.fromDate(newRecording.createdAt),
          updatedAt: Timestamp.fromDate(newRecording.updatedAt),
        });

        setAudioURL(url);
        audioChunks.current = [];
      };

      startTimeRef.current = Date.now();
      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  return {
    recording,
    audioURL,
    startRecording,
    stopRecording,
  };
};
