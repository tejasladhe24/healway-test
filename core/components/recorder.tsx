"use client";

import { useAudioRecorder } from "@/core/hooks/use-recorder";
import { Button } from "./ui/button";

export const AudioRecorder = () => {
  const { recording, audioURL, startRecording, stopRecording } =
    useAudioRecorder();

  return (
    <Button onClick={recording ? stopRecording : startRecording}>
      {recording ? "Stop Recording" : "Start Recording"}
    </Button>
  );
};
