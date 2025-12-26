import { createContext } from "react";

interface ModalContextType {
  openModal: ({
    title,
    content,
    closeEffect,
  }: {
    title: string;
    content: React.ReactNode;
    closeEffect?: () => void;
  }) => void;
  closeModal: () => void;
  closeAllModals: () => void;
  modals: { content: React.ReactNode }[];
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
