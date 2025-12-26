import type { ReactNode } from "react";

export const EditorButton = ({
  CSSclass,
  icon,
  title,
  onClick,
}: {
  CSSclass: string;
  icon: ReactNode;
  title: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={`flex justify-center items-center p-2 border-2 rounded-sm cursor-pointer duration-200 ${CSSclass}`}
      title={title}
      onClick={onClick}
    >
      <i className={`di di-${icon} text-md`}></i>
    </button>
  );
};
