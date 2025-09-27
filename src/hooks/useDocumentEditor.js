import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import FontSize from "../extensions/FontSize";
import { cursorPlugin } from "../extensions/cursorPlugin";

const useDocumentEditor = (cursorsRef) => {
  return useEditor({
    extensions: [
      // Heading을 따로 쓰려고 StarterKit의 heading 비활성화
      StarterKit.configure({ heading: false }),

      Heading.configure({ levels: [1, 2, 3] }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      FontSize,
      Placeholder.configure({ placeholder: "여기에 내용을 작성하세요…" }),
      cursorPlugin(cursorsRef),
    ],
    content: "",
  });
};

export default useDocumentEditor;
