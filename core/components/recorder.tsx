"use client";

import { useAudioRecorder } from "@/core/hooks/use-recorder";
import { Button } from "./ui/button";
import { Settings2 } from "lucide-react";
import { useModal } from "../hooks/use-modal";

export const AudioRecorder = () => {
  const { recording, startRecording, stopRecording } = useAudioRecorder();
  const { onOpen } = useModal();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={recording ? "destructive" : "outline"}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop Recording" : "Start New Recording"}
      </Button>
    </div>
  );
};
