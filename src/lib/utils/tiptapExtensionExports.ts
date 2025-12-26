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
import Emoji, { gitHubEmojis as GithubEmojis } from "@tiptap/extension-emoji";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

export const tiptapExtensions = [
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
    emojis: GithubEmojis,
    enableEmoticons: true,
  }),
  Document,
  Heading.configure({
    levels: [1, 2, 3],
  }),
  Paragraph,
  Text,
];
