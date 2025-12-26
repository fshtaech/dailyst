import type { JournalType } from "../db/firebase/types/Journal";
import type { ReactElement } from "react";
import React, { useEffect, useRef, useState } from "react";

export const JournalPaper = ({ journal }: { journal: JournalType }) => {
  const journalPaperRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState<boolean>(false);

  const generateJournalContent = () => {
    const body: ReactElement = React.createElement("div", {
      className: "journal-paper tiptap-editor-content",
      dangerouslySetInnerHTML: { __html: journal.content },
    });

    return body;
  };

  useEffect(() => {
    setScrollable(journalPaperRef.current!.scrollHeight >= 350);
  }, [setScrollable]);

  return (
    <div className="grow bg-clip-border">
      <div
        ref={journalPaperRef}
        className="relative border-2 overflow-hidden rounded-md p-4 min-h-[100px] h-fit max-h-[350px]"
      >
        <button
          className="absolute -right-15 -top-11 hover:-right-11 hover:-top-3 pb-10 hover:pb-0 bg-accent-500/50 hover:bg-accent-500/80 flex justify-center items-center w-30 h-15 rotate-45 cursor-pointer text-text-50 transition-all duration-400"
          title={journal.pinned ? "Pinned" : "Pin"}
        >
          <i
            className={`di di-pin${
              journal.pinned ? "-filled" : ""
            } text-2xl -rotate-45`}
          ></i>
        </button>
        <h3 className="block mb-4 text-xl font-medium break-keep wrap-normal">
          {journal.title}
        </h3>
        {generateJournalContent()}

        {scrollable && (
          <span className="absolute w-full h-15 left-0 bottom-0 flex items-center justify-center scroll-shadow text-accent-500 text-md ">
            .....
          </span>
        )}
      </div>
    </div>
  );
};
