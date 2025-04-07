import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

const useDocumentEditor = () => {
  return useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
    ],
    content: "",
  });
};

export default useDocumentEditor;
