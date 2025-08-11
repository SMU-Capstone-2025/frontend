import React, { useMemo } from "react";
import NextAltOn from "../../../assets/icons/NextAlt/NextAltOn";
import PreviousAltOn from "../../../assets/icons/PreviousAlt/PreviousAltOn";
import Italic from "../../../assets/icons/DocIcons/Italic.svg";
import AlignCenter from "../../../assets/icons/DocIcons/AlignCenter.svg";
import AlignLeft from "../../../assets/icons/DocIcons/AlignL.svg";
import AlignRight from "../../../assets/icons/DocIcons/AlignR.svg";
import Justify from "../../../assets/icons/DocIcons/Justify.svg";
import UnderLine from "../../../assets/icons/DocIcons/Underline.svg";
import DocMinus from "../../../assets/icons/DocIcons/DocMinus.svg";
import DocPlus from "../../../assets/icons/DocIcons/DocPlus.svg";
import ColorPickerDropdown from "./ColorPickerDropdown";

const Divider = () => (
  <div className="w-px h-[30px] bg-[#d9d9d9]" aria-hidden="true" />
);

const EditorToolbar = ({ editor }) => {
  // 현재 폰트 크기(px)
  const currentSize = useMemo(() => {
    const v = editor.getAttributes("textStyle")?.fontSize;
    if (!v) return 16;
    const n = Number(String(v).replace(/px|rem/i, ""));
    return Number.isFinite(n) ? n : 16;
  }, [editor.state]);
  const setPx = (n) => editor.chain().focus().setFontSize(`${n}px`).run();
  const dec = () => setPx(Math.max(8, currentSize - 1));
  const inc = () => setPx(Math.min(72, currentSize + 1));

  const btn = (active) =>
    [
      "rounded-[10px] transition-colors",
      active
        ? "bg-gray-200 rounded-[10px]"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ].join(" ");

  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  const colorOptions = [
    {
      name: "Red",
      hex: "#EF4444",
      bg: "#FDDADA",
      border: "#EF4444",
      letter: "#EF4444",
    },
    {
      name: "Yellow",
      hex: "#FACC15",
      bg: "#FDF5DA",
      border: "#FACC15",
      letter: "#FACC15",
    },
    {
      name: "Green",
      hex: "#10B981",
      bg: "#E7FDDA",
      border: "#10B981",
      letter: "#10B981",
    },
    {
      name: "Blue",
      hex: "#3B82F6",
      bg: "#DAF4FD",
      border: "#3B82F6",
      letter: "#3B82F6",
    },
    {
      name: "Purple",
      hex: "#8B5CF6",
      bg: "#F5E5FF",
      border: "#8B5CF6",
      letter: "#8B5CF6",
    },
    {
      name: "Black",
      hex: "#000000",
      bg: "#E4E4E4",
      border: "#000000",
      letter: "#000000",
    },
  ];

  return (
    <div className="flex items-center gap-6">
      {/* Undo / Redo */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="flex items-center justify-center w-6 h-6 disabled:opacity-40"
          disabled={!canUndo}
          aria-label="되돌리기"
          title="되돌리기 (CtrlZ)"
        >
          <PreviousAltOn />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="flex items-center justify-center w-6 h-6 disabled:opacity-40"
          disabled={!canRedo}
          aria-label="다시 실행"
          title="다시 실행 (CtrlShiftZ)"
        >
          <NextAltOn />
        </button>
      </div>

      <Divider />

      {/* 본문/헤딩 드롭다운 */}
      <select
        className="bg-white border border-gray-200 text-sm rounded px-2 py-1"
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
        }
        onChange={(e) => {
          const v = e.target.value;
          const ch = editor.chain().focus();
          if (v === "p") ch.setParagraph().run();
          if (v === "h1") ch.toggleHeading({ level: 1 }).run();
          if (v === "h2") ch.toggleHeading({ level: 2 }).run();
          if (v === "h3") ch.toggleHeading({ level: 3 }).run();
        }}
        title="본문/제목"
      >
        <option value="p">본문</option>
        <option value="h1">제목 1</option>
        <option value="h2">제목 2</option>
        <option value="h3">제목 3</option>
      </select>

      <Divider />

      {/* 폰트 크기 */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={dec}
          className=" rounded p-2 bg-gray-100 hover:bg-gray-200"
          title="작게"
        >
          <img src={DocMinus} alt="작게" />
        </button>
        <span className="w-8 text-center text-[18px] text-[#1f2937] font-[400] leading-[140%]">
          {currentSize}
        </span>
        <button
          type="button"
          onClick={inc}
          className=" rounded p-2 bg-gray-100 hover:bg-gray-200"
          title="크게"
        >
          <img src={DocPlus} alt="크게" />
        </button>
      </div>

      <Divider />

      {/* Inline styles */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
          aria-label="굵게"
          title="굵게 (Ctrl+B)"
          style={{
            display: "flex",
            padding: "1px 7px 1px 6px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
          aria-label="기울임"
          title="기울임 (Ctrl+I)"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "2.1px",
          }}
        >
          <img src={Italic} alt="Italic" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btn(editor.isActive("underline"))}
          aria-label="밑줄"
          title="밑줄 (Ctrl+U)"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "2.3px",
          }}
        >
          <img src={UnderLine} alt="underline" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btn(editor.isActive("strike"))}
          aria-label="취소선"
          title="취소선"
          style={{
            display: "flex",
            padding: "1px 7px 1px 6px",
            justifyContent: "center",
            alignItems: "center",
            textDecoration: "line-through",
          }}
        >
          S
        </button>

        <ColorPickerDropdown
          colors={colorOptions}
          currentColor={editor.getAttributes("textStyle")?.color || "#000000"}
          currentBg={
            editor.getAttributes("textStyle")?.backgroundColor || "#FFFFFF"
          }
          onSelect={(hex) => editor.chain().focus().setColor(hex).run()}
        />
      </div>

      <Divider />
      {/* 정렬 */}
      <div className="flex items-center gap-4">
        <button
          className={btn(editor.isActive({ textAlign: "left" }))}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="왼쪽 정렬"
        >
          <img src={AlignLeft} alt="AlignLeft" />
        </button>
        <button
          className={btn(editor.isActive({ textAlign: "center" }))}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="가운데 정렬"
        >
          <img src={AlignCenter} alt="AlignCenter" />
        </button>
        <button
          className={btn(editor.isActive({ textAlign: "right" }))}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="오른쪽 정렬"
        >
          <img src={AlignRight} alt="AlignRight" />
        </button>
        <button
          className={btn(editor.isActive({ textAlign: "justify" }))}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          title="양쪽 정렬"
        >
          <img src={Justify} alt="Justify" />
        </button>
      </div>

      <Divider />
    </div>
  );
};

export default EditorToolbar;
