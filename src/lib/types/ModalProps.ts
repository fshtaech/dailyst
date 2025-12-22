export type ModalProps = {
  title?: string;
  index: number;
  onClose: () => void;
  children: React.ReactNode;
};
