"use client";

import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { Recording, Transcription } from "@/types";
import { Separator } from "../ui/separator";
import PatientSummary from "../patient-summary";
import { transcribeAudio } from "@/core/client-side-handlers/transcribe";
import { summarizeText } from "@/core/client-side-handlers/summarize";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/core/provider/session-provider";

export function AudioRecordingTabView({
  recording,
  transcription,
}: {
  recording: Recording | null;
  transcription: Transcription | null;
}) {
  const [loadingTranscribe, setLoadingTranscribe] = useState<boolean>(false);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const { user } = useAuth();

  return (
    <Tabs defaultValue="transcription" className="w-full h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="transcription">Transcription</TabsTrigger>
        <TabsTrigger value="summarize">Summarize</TabsTrigger>
      </TabsList>
      <TabsContent value="transcription" className="h-full">
        <Card className="h-full">
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Transcription</CardTitle>
              <CardDescription>
                See the transcription of this recording
              </CardDescription>
            </div>
            <Button
              disabled={!recording}
              onClick={async () => {
                if (recording) {
                  setLoadingTranscribe(true);
                  await transcribeAudio(recording?.id, user);
                  setLoadingTranscribe(false);
                }
              }}
            >
              Transcribe
              {loadingTranscribe && <Loader2 className="size-4 animate-spin" />}
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col text-justify">
            {transcription?.text ? (
              transcription.text
            ) : (
              <span className="italic text-muted-foreground">No text yet</span>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="summarize">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Summarize</CardTitle>
              <CardDescription>
                Analysis and key information extracted from patient conversation
              </CardDescription>
            </div>
            <Button
              disabled={!transcription || !recording}
              onClick={async () => {
                if (recording && recording.transcriptionId) {
                  setLoadingSummary(true);
                  await summarizeText(recording?.transcriptionId, user);
                  setLoadingSummary(false);
                }
              }}
            >
              Summarize{" "}
              {loadingSummary && <Loader2 className="size-4 animate-spin" />}
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-2">
            {transcription?.summary ? (
              <PatientSummary data={transcription.summary} />
            ) : (
              <span className="italic text-muted-foreground">
                No summary yet
              </span>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
