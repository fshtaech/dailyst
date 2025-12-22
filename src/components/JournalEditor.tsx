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
import { EditorButton } from "./EditorButton";

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
      <div className="flex flex-1 flex-col px-2 border-2 rounded-md">
        <div className="flex w-full justify-between pb-2 h-[60px] lg:h-[65px]">
          <div className="flex justify-center gap-x-1 pb-6">
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
            {window.innerWidth <= 550 && (
              <button className="flex justify-center items-center p-2 max-h-fit px-3 border border-t-0 rounded-b-md border-background-950 cursor-pointer duration-200 py-2">
                <i className="di di-shuffle text-md"></i>
              </button>
            )}{" "}
          </div>
          {window.innerWidth >= 551 && (
            <div className="flex justify-center gap-x-1 pb-6">
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
            </div>
          )}
        </div>
        <EditorContent name="journal-content" editor={editor} />
      </div>
    </>
  );
};
