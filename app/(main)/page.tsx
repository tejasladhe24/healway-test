import { AudioRecordingsList } from "@/core/components/recordings-view";

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      <AudioRecordingsList />
    </div>
  );
}
