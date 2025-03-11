"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/core/components/ui/form";
import { toast } from "sonner";
import { useModal } from "@/core/hooks/use-modal";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/core/lib/firebase-utils";
import { useSettings } from "@/core/hooks/use-settings";
import { useEffect } from "react";
import { useAuth } from "@/core/provider/session-provider";

const schema = z.object({
  enableLiveTranscription: z.boolean().default(false).optional(),
});

type InputType = z.infer<typeof schema>;

export function SettingsModal() {
  const { onClose, isOpen, type } = useModal();
  const { settings } = useSettings();
  const { user } = useAuth();

  useEffect(() => {
    console.log("settings", settings);
  }, [settings]);

  const isModalOpen = isOpen && type === "settings";

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      enableLiveTranscription: false,
    },
  });

  const onSubmit = async (values: InputType) => {
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }

    const userId = user.uid;
    console.log("Saving settings for user:", userId);

    try {
      const settingsCollection = collection(db, "settings");

      const q = query(settingsCollection, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0]; // Get the first matching document
        const docRef = doc(db, "settings", existingDoc.id);

        await updateDoc(docRef, settings);
      } else {
        const newSettings = {
          userId,
          ...values,
        };

        await addDoc(settingsCollection, newSettings);
      }

      toast.info("Settings saved!");
      onClose();
    } catch (error) {
      console.error("Firestore Error:", error);
      toast.error("Failed to save settings. Check Firestore rules.");
    }
  };

  if (!settings) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="enableLiveTranscription"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      defaultChecked={settings.enableLiveTranscription}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable live transcription</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
