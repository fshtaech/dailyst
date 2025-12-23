import { useEffect, useState } from "react";
import type { ModalProps } from "../lib/types/ModalProps";

export const Modal = ({ title, index, onClose, children }: ModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);

    const timer = setTimeout(() => {
      onClose();
    }, 300);

    return () => clearTimeout(timer);
  };
  return (
    <div
      className={`z-${
        4 + index
      } fixed inset-0 flex items-center justify-center w-full h-full p-5 bg-background-800/30 backdrop-blur-xs transition ease-linear duration-300 opacity-${
        open ? "100" : "0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative border-2 bg-background-100 shadow-2xl max-w-md lg:max-w-2xl w-full p-2 lg:p-4 h-fit overflow-auto transition-all ease-in-out duration-300 translate-y-${
          open ? "0" : "1000"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center pb-2 lg:pb-4 border-b">
            <h2 className="text-xl lg:text-2xl text-accent-500">{title}</h2>
            <button
              className="flex items-center justify-center py-1 px-2 cursor-pointer text-accent-300 hover:text-accent-400"
              onClick={handleClose}
              title="Close"
            >
              <i className="di di-x font-bold text-lg"></i>
            </button>
          </div>
        )}
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};
