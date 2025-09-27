import React, { useState, useRef, useEffect } from "react";
import ColorIcon from "../../../assets/icons/DocIcons/ColorIcon";
import ArrowDownOn from "../../../assets/icons/ArrowDown/ArrowDownOn";

const ColorPickerDropdown = ({ colors, onSelect, currentBg, currentColor }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* 메인 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 rounded flex items-center gap-1 hover:bg-gray-200"
      >
        <ColorIcon
          fill={currentBg}
          stroke={currentColor}
          letterColor={currentColor}
        />
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <ArrowDownOn />
        </span>
      </button>

      {/* 드롭다운 */}
      {open && (
        <div className="absolute top-full px-[18px] py-3 mt- flex gap-2 bg-white border border-gray-200 rounded-[8px] shadow-md z-50">
          {colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                onSelect(c.hex);
                setOpen(false);
              }}
              className="rounded-lg hover:scale-110 transition"
            >
              <ColorIcon fill={c.bg} stroke={c.border} letterColor={c.letter} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPickerDropdown;
