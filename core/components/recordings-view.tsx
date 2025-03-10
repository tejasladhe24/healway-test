"use client";

import { useState, useRef } from "react";
import { Play, Pause, Edit, Trash2, Music, Loader2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
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
import { Recording } from "@/types";
import { AudioRecorder } from "./recorder";

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

  const handleRename = () => {
    if (selectedRecording && newName.trim()) {
      // update name of selected recording
      setRenameDialogOpen(false);
    }
  };

  const openDeleteDialog = (recording: Recording) => {
    setSelectedRecording(recording);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedRecording) {
      // Stop playback if deleting the currently playing recording
      if (currentlyPlaying === selectedRecording.id) {
        audioRef.current?.pause();
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      }

      // delete selected recording

      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto p-4">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Recordings</h1>
          <AudioRecorder />
        </div>
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
            <Card key={recording.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium truncate">
                      {recording.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {recording.duration.toFixed(0)} s
                    </p>
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
              </CardContent>
            </Card>
          ))}
        </div>

        {hasMore && !loading && <button onClick={loadMore}>Load More</button>}

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
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
