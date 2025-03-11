"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Edit,
  Trash2,
  Music,
  Loader2,
  Text,
  CheckCircle,
} from "lucide-react";
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
import { useRecordings } from "../hooks/use-recordings";
import { Recording, Transcription } from "@/types";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase-utils";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import Link from "next/link";
import { useAuth } from "../provider/session-provider";

export const AudioRecordingsList = () => {
  const { recordings, loading, hasMore, loadMore } = useRecordings();

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  );
  const [newName, setNewName] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { user } = useAuth();

  const handlePlay = (id: string, url: string) => {
    if (currentlyPlaying === id) {
      // Toggle play/pause for current audio
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      // Play a new audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setCurrentlyPlaying(id);

      // In a real app, we would set the src to the actual audio file
      // For this example, we'll just simulate playback
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      };

      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        // In a real app, we would handle playback errors appropriately
      });

      setIsPlaying(true);
    }
  };

  const openRenameDialog = (recording: Recording) => {
    setSelectedRecording(recording);
    setNewName(recording.title);
    setRenameDialogOpen(true);
  };

  const openDeleteDialog = (recording: Recording) => {
    setSelectedRecording(recording);
    setDeleteDialogOpen(true);
  };
  const handleRename = async () => {
    if (!user) {
      return toast.error("You must be logged in to rename a recording.");
    }

    if (selectedRecording && newName.trim()) {
      try {
        const docRef = doc(db, "audio-recordings", selectedRecording.id);
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
      return toast.error("You must be logged in to delete a recording.");
    }

    if (selectedRecording) {
      // Stop playback if deleting the currently playing recording
      if (currentlyPlaying === selectedRecording.id) {
        audioRef.current?.pause();
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      }

      try {
        const docRef = doc(db, "audio-recordings", selectedRecording.id);
        await deleteDoc(docRef);

        setDeleteDialogOpen(false);
        toast.info("Recording deleted");
      } catch (err) {
        console.error("Error deleting recording:", err);
        toast.error("Failed to delete recording");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full p-4">
      <div className="flex flex-col gap-4 w-full">
        {loading && (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="animate-spin size-10" />
          </div>
        )}

        {!loading && recordings.length === 0 && (
          <div className="text-center py-12">
            <Music className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">
              No recordings found
            </p>
          </div>
        )}

        <div className="space-y-3">
          {recordings.map((recording) => (
            <Card key={recording.id} className="overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 flex-col min-w-0">
                      <Link
                        href={`/recordings/${recording.id}`}
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "text-base font-medium truncate px-0 transition"
                        )}
                      >
                        {recording.title}
                      </Link>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-muted-foreground">
                          Duration {recording.duration.toFixed(0)} s
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

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePlay(recording.id, recording.url)}
                        aria-label={
                          isPlaying && currentlyPlaying === recording.id
                            ? "Pause"
                            : "Play"
                        }
                      >
                        {isPlaying && currentlyPlaying === recording.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openRenameDialog(recording)}
                        aria-label="Rename"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(recording)}
                        aria-label="Delete"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {hasMore && !loading && (
          <Button variant={"link"} onClick={loadMore}>
            Load More
          </Button>
        )}

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
                Are you sure you want to delete "{selectedRecording?.title}"?
                This action cannot be undone.
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
    </div>
  );
};
