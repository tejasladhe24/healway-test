"use client";

import { useAudioRecorder } from "@/core/hooks/use-recorder";
import { Button } from "./ui/button";

export const AudioRecorder = () => {
  const { recording, startRecording, stopRecording } = useAudioRecorder();

  return (
    <Button
      variant={recording ? "destructive" : "outline"}
      onClick={recording ? stopRecording : startRecording}
    >
      {recording ? "Stop Recording" : "Start New Recording"}
    </Button>
  );
};
