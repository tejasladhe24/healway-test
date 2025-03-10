"use client";

import { useEffect, useState } from "react";
import { SettingsModal } from "../components/modals/settings";
// import { RenameRecordingModal } from "../components/modals/rename-recording";
// import { DeleteRecordingModal } from "../components/modals/delete-recording";

export const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <SettingsModal />
      {/* <RenameRecordingModal />
      <DeleteRecordingModal /> */}
    </>
  );
};
