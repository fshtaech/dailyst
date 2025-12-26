import { Editor, useEditor, EditorContent } from "@tiptap/react";
import { tiptapExtensions } from "../lib/utils/tiptapExtensionExports";
import { EditorButton } from "./EditorButton";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { getRandomArrayItem } from "../lib/utils/get";
import { greetings } from "../assets/message/greetings";
import { journalService } from "../db/firebase/services/journal.service";
import type { JournalType } from "../db/firebase/types/Journal";
import { InvalidPushError } from "../db/firebase/exceptions/InvalidPushError";
import { useModal } from "../lib/hooks/useModal";
import { OutsiderModal } from "../components/OutsiderModal";
import { useAuthContext } from "../db/firebase/contexts/AuthContext";

export const JournalEditor = () => {
  const { currentUser } = useAuthContext();
  const [journalPlaceholder, setJournalPlaceholder] = useState<string>(() => {
    return greetings ? getRandomArrayItem(greetings.journal) : "";
  });
  const [infoActive, setInfoActive] = useState<boolean>(false);
  const [bookmarkActive, setBookmarkActive] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>("");
  const [journalTitle, setJournalTitle] = useState<string>("");
  const { openModal } = useModal();
  const journalTitleInputRef = useRef<HTMLInputElement>(null);
  const editor: Editor = useEditor({
    extensions: tiptapExtensions,
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML());
    },
    onCreate({ editor }) {
      editor.commands.focus();
    },
  });

  const bookmarkJournal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser) {
      return openModal({
        ...OutsiderModal(),
        closeEffect: () => setBookmarkActive(false),
      });
    }

    if (editorContent.length === 0 || journalTitle.length === 0) {
      return openModal({
        title: "It's Empty!",
        content:
          "Hey! So, did you forget to add content to your journal? Add some before bookmarking it!",
        closeEffect: () => setBookmarkActive(false),
      });
    }

    const formData = new FormData(e.currentTarget);

    const journal: JournalType = {
      title: formData.get("journal-title") as string,
      content: editorContent,
    };

    journalService
      .createUserJournal(journal)
      .then(() => {
        openModal({
          title: "One More to The Journal",
          content:
            "You have bookmarked a journal. You can now view it in your Journals. Keep at it!",
          closeEffect: () => {
            setJournalTitle("");
            setBookmarkActive(false);
            setEditorContent("");
            editor.commands.clearContent();
          },
        });
      })
      .catch((error) => {
        throw new InvalidPushError(
          "Unable to create new journal. Error " + error
        );
      });
  };

  useEffect(() => {
    const interval: number = setInterval(() => {
      setJournalPlaceholder(getRandomArrayItem(greetings.journal));
    }, 900000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex flex-col flex-1 gap-2 border-2 p-2 rounded-md bg-secondary-50 checkered-bg">
        <form
          onSubmit={bookmarkJournal}
          className="flex items-center text-lg py-2 px-6 border-2 rounded-md bg-secondary-100 focus-within:border-accent-400"
        >
          <div className="relative flex">
            <button
              className={`flex items-center px-1 cursor-pointer ${
                !infoActive && "mr-4"
              }`}
              type="button"
              title="Curious? Click me"
              onClick={() => setInfoActive(!infoActive)}
            >
              <i className="di di-info text-xl text-text-800"></i>
            </button>
            <span
              onClick={() => {
                setInfoActive(!infoActive);
                journalTitleInputRef.current?.focus();
              }}
              className={`absolute -left-100 text-accent-400 whitespace-nowrap transition-all duration-500 ${
                infoActive
                  ? "ease-out translate-x-112 opacity-100"
                  : "-translate-x-112 opacity-0 ease-in"
              }`}
            >
              Add your journal title here!
            </span>
          </div>
          <input
            ref={journalTitleInputRef}
            type="text"
            name="journal-title"
            id="journal-title"
            placeholder={
              !infoActive
                ? `https://${journalPlaceholder
                    .toLowerCase()
                    .replaceAll(" ", ".")}`
                : ""
            }
            value={!infoActive ? journalTitle : ""}
            autoComplete="off"
            className="flex-1 placeholder:text-zinc-500 focus:outline-0 text-ellipsis autofill:bg-inherit!"
            onFocus={() => setInfoActive(false)}
            onChange={(e) => setJournalTitle(e.target.value)}
          />

          <button
            type="submit"
            className="flex items-center px-1 cursor-pointer rounded-sm hover:bg-secondary-200 duration-200"
            title="Save Journal"
            onClick={() => setBookmarkActive(true)}
          >
            <i
              className={`di di-star${
                bookmarkActive ? "-filled text-accent-500" : ""
              } text-xl text-accent-400  transition-all duration-200`}
            ></i>
          </button>
        </form>
        <div className="flex flex-1 gap-x-2">
          <div className="flex flex-col h-full gap-1 w-[60px] lg:w-[65px]">
            <p className="text-sm mb-1">Styles</p>
            <EditorButton
              CSSclass="bg-violet-400 hover:bg-violet-500"
              icon="bold"
              title="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <EditorButton
              CSSclass="bg-cyan-400 hover:bg-cyan-500"
              icon="italic"
              title="Italicize"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <EditorButton
              CSSclass="bg-indigo-400 hover:bg-indigo-500"
              icon="underline"
              title="Underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <EditorButton
              CSSclass="bg-rose-400 hover:bg-rose-500"
              icon="quote"
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
            <EditorButton
              CSSclass="bg-emerald-400 hover:bg-emerald-500"
              icon="heading-1"
              title="Heading 1"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            />
            <EditorButton
              CSSclass="bg-red-400 hover:bg-red-500"
              icon="heading-2"
              title="Heading 2"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            />
            <EditorButton
              CSSclass="bg-pink-400 hover:bg-pink-500"
              icon="bullet-list"
              title="Bullet List"
              onClick={() =>
                editor.chain().focus().toggleBulletList().focus().run()
              }
            />
            <EditorButton
              CSSclass="bg-yellow-400 hover:bg-yellow-500"
              icon="number-list"
              title="Number List"
              onClick={() =>
                editor.chain().focus().toggleOrderedList().focus().run()
              }
            />
            <EditorButton
              CSSclass="bg-blue-400 hover:bg-blue-500"
              icon="link"
              title="Link"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleLink({
                    href: (editor.getAttributes("link").href = `${
                      editor.getText().includes("://") ? "http://" : ""
                    }${editor.getText()}`),
                  })
                  .run()
              }
            />
            <p className="text-sm my-1">Tools</p>
            <EditorButton
              CSSclass="bg-green-400 hover:bg-green-500"
              icon="arrow-left"
              title="Undo"
              onClick={() => editor.chain().focus().undo().run()}
            />
            <EditorButton
              CSSclass="bg-orange-400 hover:bg-orange-500"
              icon="arrow-right"
              title="Redo"
              onClick={() => editor.chain().focus().redo().run()}
            />
            {/* <div className="flex flex-col justify-center ">
              {/* {window.innerWidth <= 550 && (
                <button className="flex justify-center items-center p-2 max-h-fit px-3 border border-t-0 rounded-b-md border-background-950 cursor-pointer duration-200 py-2">
                  <i className="di di-shuffle text-md"></i>
                </button>
              )}{" "}}
            </div> */}
          </div>
          <EditorContent name="journal-content" editor={editor} />
        </div>
      </div>
    </>
  );
};
