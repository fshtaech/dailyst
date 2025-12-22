import { createContext } from "react";

interface ModalContextType {
  openModal: ({
    title,
    content,
  }: {
    title: string;
    content: React.ReactNode;
  }) => void;
  closeModal: () => void;
  closeAllModals: () => void;
  modals: { content: React.ReactNode }[];
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
