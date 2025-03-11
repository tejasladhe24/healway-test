import { create } from "zustand";

export type ModalType = "renameRecording" | "deleteRecording" | "settings";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: Record<string, any>;
  onOpen: (type: ModalType, data?: Record<string, any>) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set, get) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data) =>
    set({ isOpen: true, type, data: { ...get().data, ...data } }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      data: {},
    }),
}));
