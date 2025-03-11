import { AudioRecording } from "@/core/components/audio-recording";
import { SidebarInset, SidebarTrigger } from "@/core/components/ui/sidebar";

export default async function RecordingIDPage({
  params,
}: {
  params: Promise<{ recordingId: string }>;
}) {
  const { recordingId } = await params;

  return (
    <SidebarInset>
      <header className="sticky top-0 w-full flex items-center gap-2 px-4 py-2 font-semibold border-b bg-sidebar">
        <SidebarTrigger />
        {recordingId}
      </header>
      <div className="flex flex-col">
        <AudioRecording recordingId={recordingId} />
      </div>
    </SidebarInset>
  );
}
