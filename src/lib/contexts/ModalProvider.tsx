import { useState } from "react";
import { ModalContext } from "./ModalContext";
import { createPortal } from "react-dom";
import { Modal } from "../../components/Modal";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<
    { title: string; content: React.ReactNode }[]
  >([]);

  const openModal = ({
    title,
    content,
  }: {
    title: string;
    content: React.ReactNode;
  }) => {
    setModals((prev) => [...prev, { title, content }]);
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
            onClose={closeModal}
          >
            {modal.content}
          </Modal>,
          document.body
        )
      )}
    </ModalContext.Provider>
  );
};
