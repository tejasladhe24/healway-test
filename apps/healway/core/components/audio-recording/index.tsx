"use client";

import { useState, useRef } from "react";
import { Play, Pause, Edit, Trash2, Loader2, CheckCircle } from "lucide-react";
import { Button, buttonVariants } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";
import { Recording } from "@/types";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase-utils";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { useRecording } from "../../hooks/use-recording";
import { AudioRecordingTabView } from "./tab-view";
import { useAuth } from "@/core/provider/session-provider";

export const AudioRecording = ({ recordingId }: { recordingId: string }) => {
  const { loading, recording, transcription } = useRecording({ recordingId });

  const [isPlaying, setIsPlaying] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useAuth();

  const handlePlay = () => {
    // Toggle play/pause for current audio
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const openRenameDialog = (recording: Recording) => {
    setNewName(recording?.title);
    setRenameDialogOpen(true);
  };

  const openDeleteDialog = () => setDeleteDialogOpen(true);

  const handleRename = async () => {
    if (!user) {
      return toast.error("You must be logged in to rename a recording?.");
    }

    if (newName.trim()) {
      try {
        const docRef = doc(db, "audio-recordings", recordingId);
        await updateDoc(docRef, { title: newName });

        setRenameDialogOpen(false);
        toast.info("Recording renamed");
      } catch (err) {
        console.error("Error renaming recording:", err);
        toast.error("Failed to rename recording");
      }
    }
  };
  const handleDelete = async () => {
    if (!user) {
      return toast.error("You must be logged in to delete a recording?.");
    }

    // Stop playback if deleting the currently playing recording
    audioRef.current?.pause();
    setIsPlaying(false);

    try {
      const docRef = doc(db, "audio-recordings", recordingId);
      await deleteDoc(docRef);

      setDeleteDialogOpen(false);
      toast.info("Recording deleted");
    } catch (err) {
      console.error("Error deleting recording:", err);
      toast.error("Failed to delete recording");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loader2 className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4">
      <div className="flex flex-col gap-4 w-full">
        <Card key={recordingId} className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:justify-between gap-4 p-4">
              <div className="flex flex-col">
                <h3
                  className={cn(
                    "text-base font-medium truncate whitespace-nowrap px-0 transition"
                  )}
                >
                  {recording?.title}
                </h3>
                <div className="flex items-center gap-8">
                  <p className="text-sm text-muted-foreground">
                    Duration {recording?.duration.toFixed(0)} s
                  </p>
                  {recording?.transcriptionId && (
                    <h1 className="flex items-center text-xs gap-2">
                      Transcripted{" "}
                      <CheckCircle
                        className="size-4 text-green-600"
                        strokeWidth={2}
                      />
                    </h1>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePlay()}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                {recording && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openRenameDialog(recording)}
                    aria-label="Rename"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}

                {recording && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={openDeleteDialog}
                    aria-label="Delete"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rename Dialog */}
        <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Recording</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="recording-name">New name</Label>
              <Input
                id="recording-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-2"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRenameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRename}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Recording</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "
                {recording?.title || "[NOT_FOUND]"}"? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className={cn(buttonVariants({ variant: "destructive" }))}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <AudioRecordingTabView
        recording={recording}
        transcription={transcription}
      />
    </div>
  );
};
