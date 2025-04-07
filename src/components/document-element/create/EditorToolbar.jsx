import React from "react";
import NextAltOn from "../../../assets/icons/NextAlt/NextAltOn";
import PreviousAltOn from "../../../assets/icons/PreviousAlt/PreviousAltOn";

const Divider = () => <div className="w-px h-[30px] bg-[#d9d9d9]" />;

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const buttonClass = (active) =>
    active
      ? "bg-blue-500 text-white px-2 py-1 rounded"
      : "bg-gray-100 text-gray-700 px-2 py-1 rounded";

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="flex items-center w-6 h-6"
        >
          <PreviousAltOn />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="flex items-center w-6 h-6"
        >
          <NextAltOn />
        </button>
      </div>
      <Divider />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
        >
          S
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={buttonClass(editor.isActive("paragraph"))}
        >
          P
        </button>
      </div>
      <Divider />
      <div className="flex items-center gap-1">
        {/* 빨간색 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setColor("#EF4444").run()}
          className="w-6 h-6 rounded-full bg-red-500 border border-gray-300 hover:scale-110 transition"
          title="Red"
        />
        {/* 파란색 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setColor("#3B82F6").run()}
          className="w-6 h-6 rounded-full bg-blue-500 border border-gray-300 hover:scale-110 transition"
          title="Blue"
        />
        {/* 초록색 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setColor("#10B981").run()}
          className="w-6 h-6 rounded-full bg-green-500 border border-gray-300 hover:scale-110 transition"
          title="Green"
        />
        {/* 보라색 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setColor("#8B5CF6").run()}
          className="w-6 h-6 rounded-full bg-purple-500 border border-gray-300 hover:scale-110 transition"
          title="Purple"
        />
        {/* 검정색 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setColor("#000000").run()}
          className="w-6 h-6 rounded-full bg-black border border-gray-300 hover:scale-110 transition"
          title="Black"
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
