import React from "react";

type ToggleType = "hover" | "click";
type PopoverPosition =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-right"
  | "top-middle"
  | "top-left"
  | "bottom-right"
  | "bottom-middle"
  | "bottom-left";

type PopoverProps = {
  children: React.ReactNode;
  toggle?: ToggleType;
  position?: PopoverPosition;
  toggled?: boolean;
};

export const Popover: React.FC<PopoverProps> = ({
  children,
  toggle = "hover",
  position = "top",
  toggled = false,
}) => {
  const injectPosition = (): string => {
    return position == "top"
      ? "-translate-x-1 bottom-full"
      : position == "right"
      ? "top-1/2 ml-1 left-full"
      : position == "bottom"
      ? "-translate-x-1 top-full"
      : position == "left"
      ? "top-1/2 mr-1 right-full"
      : position == "top-right"
      ? "mb-1 bottom-full left-full"
      : position == "top-middle"
      ? "-translate-x-1/3 mb-1 bottom-full"
      : position == "top-left"
      ? "mb-1 bottom-full right-full"
      : position == "bottom-right"
      ? "mt-1 top-full left-full"
      : position == "bottom-middle"
      ? "-translate-x-1/3 mt-1 top-full"
      : "mt-1 top-full right-full";
  };

  return (
    <div
      className={`-z-10 absolute transform transition-all whitespace-nowrap py-2 px-2 text-sm bg-background-100 rounded-xs border-2 shadow-2xl opacity-0 hover:opacity-0 ${
        toggle == "hover"
          ? "z-10 group-hover:opacity-100"
          : toggled
          ? "z-10 opacity-100"
          : ""
      } ${injectPosition()}`}
    >
      {children}
    </div>
  );
};
