import React, { useEffect, useState } from "react";
import AiIcon from "../../../assets/icons/DocIcons/Ai.svg";

const SummaryFloatingButton = ({
  visible = true,
  onSummaryClick,
  onCorrectClick,
}) => {
  const [open, setOpen] = useState(false);

  // 패널이 열리면 버튼 드롭다운도 자동으로 닫기
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  return (
    <div
      className={[
        "fixed bottom-8 right-8 flex flex-col items-end z-50",
        "transition-all duration-300 ease-out font-[Palanquin]",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none",
      ].join(" ")}
      aria-hidden={!visible}
    >
      {/* 드롭다운 */}
      {open && (
        <div className="mb-4 mr-[2px] bg-gray-900 text-white text-sm rounded-[20px] px-4 py-3 relative shadow-sm">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                setOpen(false);
                onSummaryClick();
              }}
              className="hover:underline text-left"
            >
              텍스트 요약 생성
            </button>
            <hr className="my-1 border-gray-600" />
            <button
              onClick={() => {
                setOpen(false);
                onCorrectClick();
              }}
              className="hover:underline text-left"
            >
              문법 및 문단 교정
            </button>
          </div>
          {/* 말풍선 꼬리 */}
          <div className="absolute bottom-[-4px] right-4 w-3 h-3 bg-gray-900 rotate-45" />
        </div>
      )}

      {/* 메인 플로팅 버튼 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-[50px] h-[50px] rounded-full bg-[#3191F2] text-white flex items-center justify-center shadow-lg hover:bg-blue-500 transition"
      >
        <img src={AiIcon} alt="AI" />
      </button>
    </div>
  );
};

export default SummaryFloatingButton;
