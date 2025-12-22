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
      className={`flex justify-center items-center p-3 lg:p-4 max-h-fit px-3 md:px-4 lg:px-5 border border-t-0 rounded-b-md border-background-950 cursor-pointer duration-200 ${CSSclass} hover:py-5 lg:hover:py-6`}
      title={title}
      onClick={onClick}
    >
      <i className={`di di-${icon} text-md`}></i>
    </button>
  );
};
