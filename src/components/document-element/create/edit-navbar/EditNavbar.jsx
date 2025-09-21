import React, { useState } from "react";
import ArrowLeftOn from "../../../../assets/icons/ArrowLeft/ArrowLeftOn";
import PersonOn from "../../../../assets/icons/Person/PersonOn";
import VectorOn from "../../../../assets/icons/Vector/VectorOn";
import EditorToolbar from "../EditorToolbar";
import Status from "../../../Status/Status";
import { Share2 } from "lucide-react";

const EditNavbar = ({
  title,
  onTitleChange,
  onBack,
  editor,
  documentId,
  editors = [],
  onHistoryClick,
  status,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = ["PENDING", "PROGRESS", "COMPLETED", "ETC"];

  return (
    <div className="relative w-full h-auto shrink-0 border-b border-[#e5e7eb] bg-white flex flex-col gap-y-4 font-[Palaquin]">
      {/* 상단 */}
      <div className="flex items-center justify-between w-full px-4 py-3 sm:px-7">
        {/* 왼쪽: 뒤로가기 + 제목 */}
        <div className="flex items-center gap-3 sm:gap-5 w-full max-w-[1000px]">
          <button
            onClick={onBack}
            className="flex items-center justify-center transition cursor-pointer hover:opacity-30 shrink-0"
          >
            <ArrowLeftOn />
          </button>
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="새 문서 작성"
            title={title}
            className="text-lg sm:text-2xl p-1 sm:p-2 truncate w-full font-bold leading-[120%] tracking-[-0.06em] text-gray-800 bg-transparent"
          />
        </div>

        {/* 오른쪽: 상태 드롭다운 + 에디터(데스크탑만) + 공유 버튼 */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          {/* 상태 드롭다운 */}
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <Status name={status} />
            </div>
            {isOpen && (
              <div className="absolute right mt-1 w-[90px] bg-white border border-gray-200 rounded-md shadow-lg z-50 flex flex-col items-center">
                {statusOptions.map((opt) => (
                  <div
                    key={opt}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      onStatusChange(opt);
                      setIsOpen(false);
                    }}
                  >
                    <Status name={opt} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 프로필 아이콘 → 모바일에서는 숨김 */}
          <div className="hidden sm:flex h-10 items-center gap-[6px] -space-x-3">
            {editors.slice(0, 2).map((email, i) => (
              <div
                key={i}
                className={`flex w-10 h-10 items-center justify-center rounded-full border-[1.5px] border-white ${
                  i % 2 === 0 ? "bg-blue-100" : "bg-yellow-100"
                }`}
                title={email}
              >
                <PersonOn
                  color={i % 2 === 0 ? "#5BA7F7" : "#FACC15"}
                  size={22}
                />
              </div>
            ))}
            {editors.length > 2 && (
              <div
                className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full bg-black/50"
                title={`외 ${editors.length - 2}명`}
              >
                +{editors.length - 2}
              </div>
            )}
          </div>

          {/* 공유 버튼: 모바일은 아이콘 / 데스크탑은 텍스트 */}
          <button
            className="hidden sm:flex text-white text-sm font-semibold h-10 px-4 py-2 justify-center items-center gap-2 rounded bg-[#3191f2] hover:opacity-30 transition cursor-pointer"
            onClick={() => {
              const link = window.location.href;
              navigator.clipboard
                .writeText(link)
                .then(() => alert("문서 링크가 복사되었습니다!"))
                .catch(() => alert("링크 복사에 실패했습니다."));
            }}
          >
            공유하기
          </button>
          <button
            className="sm:hidden inline-flex p-1 items-center justify-center rounded bg-[#3191f2] text-white hover:opacity-30 transition cursor-pointer border-none"
            onClick={() => {
              const link = window.location.href;
              navigator.clipboard
                .writeText(link)
                .then(() => alert("문서 링크가 복사되었습니다!"))
                .catch(() => alert("링크 복사에 실패했습니다."));
            }}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* 에디터 툴바 */}
      <div className="flex items-center justify-between px-4 pb-3 sm:px-7">
        <div className="flex overflow-x-auto no-scrollbar px-5 py-2 rounded-[200px] bg-[#F3F4F6] max-w-full">
          <EditorToolbar editor={editor} />
        </div>
        <div
          className="flex w-6 h-6 items-center justify-center p-[3px] opacity-50 cursor-pointer hover:opacity-100 transition sm:ml-1"
          onClick={onHistoryClick}
        >
          <VectorOn />
        </div>
      </div>
    </div>
  );
};

export default EditNavbar;
