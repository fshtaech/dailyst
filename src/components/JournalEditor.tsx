import { Editor, useEditor, EditorContent } from "@tiptap/react";
import Strike from "@tiptap/extension-strike";
import Bold from "@tiptap/extension-bold";
import Blockquote from "@tiptap/extension-blockquote";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { UndoRedo } from "@tiptap/extensions";
import {
  TaskList,
  TaskItem,
  BulletList,
  ListItem,
  OrderedList,
} from "@tiptap/extension-list";
import Link from "@tiptap/extension-link";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import type { ReactNode } from "react";

const EditorButton = ({
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
      className={`flex justify-center items-center p-2 px-3 border-2 border-background-950/0 cursor-pointer duration-200 ${CSSclass} hover:border-background-950`}
      title={title}
      onClick={onClick}
    >
      <i className={`di di-${icon} text-md`}></i>
    </button>
  );
};

export const JournalEditor = ({
  setAction,
}: {
  setAction: (m: string) => void;
}) => {
  const editor: Editor = useEditor({
    extensions: [
      Strike,
      Bold,
      Blockquote,
      Italic,
      Underline,
      Youtube,
      TaskList,
      TaskItem,
      BulletList,
      ListItem,
      OrderedList,
      UndoRedo,
      Link,
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
      }),
      Document,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Paragraph,
      Text,
    ],
    onUpdate({ editor }) {
      setAction(editor.getHTML());
    },
  });

  return (
    <>
      <div className="relative flex tiptap-container p-2 border-2 flex-1">
        <EditorContent name="journal-content" editor={editor} />

        <div className="absolute bottom-2 right-2 flex w-fit h-fit justify-end gap-x-1.5">
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
        </div>

        <div className="absolute top-2 right-2 flex w-fit h-fit flex-col gap-y-1.5">
          <EditorButton
            CSSclass="bg-violet-400 hover:bg-violet-500"
            icon="bold"
            title="Bold;Ctrl+B"
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <EditorButton
            CSSclass="bg-cyan-400 hover:bg-cyan-500"
            icon="italic"
            title="Italicize;Ctrl+I"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <EditorButton
            CSSclass="bg-indigo-400 hover:bg-indigo-500"
            icon="underline"
            title="Underline;Ctrl+U"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <EditorButton
            CSSclass="bg-rose-400 hover:bg-rose-500"
            icon="quote"
            title="Blockquote;>"
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
        </div>
      </div>
    </>
  );
};
