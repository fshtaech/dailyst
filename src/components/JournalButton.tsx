import type { ReactNode } from "react";

export const JournalButton = ({
  icon,
  label,
  clickEvent,
}: {
  icon: ReactNode;
  label: string;
  clickEvent: () => void;
}) => {
  return (
    <button
      className="flex justify-center items-center"
      title={label}
      onClick={clickEvent}
    >
      {icon}
      {label}
    </button>
  );
};
