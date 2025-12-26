import { useState } from "react";
import { ModalContext } from "./ModalContext";
import { createPortal } from "react-dom";
import { Modal } from "../../components/Modal";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<
    { title: string; content: React.ReactNode; closeEffect?: () => void }[]
  >([]);

  const openModal = ({
    title,
    content,
    closeEffect,
  }: {
    title: string;
    content: React.ReactNode;
    closeEffect?: () => void;
  }) => {
    setModals((prev) => [...prev, { title, content, closeEffect }]);
  };

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, closeAllModals, modals }}
    >
      {children}
      {modals.map((modal, index) =>
        createPortal(
          <Modal
            key={`modal-${index}`}
            title={modal.title}
            index={index}
            onClose={() => {
              if (modal.closeEffect) modal.closeEffect();
              closeModal();
            }}
          >
            {modal.content}
          </Modal>,
          document.body
        )
      )}
    </ModalContext.Provider>
  );
};
