"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase-utils";
import { toast } from "sonner";
import { Summary, Transcription } from "@/types";
import { User } from "firebase/auth";

export const summarizeText = async (
  transcriptionId: string,
  user: User | null
) => {
  if (!user) {
    return toast.error("You must be logged in to transcribe a recording?.");
  }

  let data;

  try {
    const docRef = doc(db, "transcriptions", transcriptionId);
    const transcript = await getDoc(docRef);

    if (!transcript.exists()) {
      return toast.error(`Transcription not found!`);
    }

    data = transcript.data() as Transcription;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_SERVER_URL}/api/summarize/with-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: data.text,
        }),
      }
    );

    console.log("response", response);

    if (response.ok) {
      const data = (await response.json()) as Summary;
      const docRef = doc(db, "transcriptions", transcriptionId);
      await updateDoc(docRef, { summary: data });
      toast.info(`Summary created for ${transcriptionId}`);
    }
  } catch (error) {
    console.error("Error summarizing content:", error);
    toast.error("Failed to summarize content");
    return;
  }
};
