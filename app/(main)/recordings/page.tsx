import { AudioRecordingsList } from "@/core/components/audio-recordings-list";
import { AudioRecorder } from "@/core/components/recorder";
import { SidebarInset, SidebarTrigger } from "@/core/components/ui/sidebar";

export default async function RecordingsPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 w-full flex items-center justify-between gap-2 px-4 py-2 font-semibold border-b bg-sidebar">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          Recordings
        </div>
        <AudioRecorder />
      </header>
      <AudioRecordingsList />
    </SidebarInset>
  );
}
