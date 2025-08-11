import React, { useMemo } from "react";
import BackIcon from "../../../assets/icons/DocIcons/Back.svg";
import InfoIcon from "../../../assets/icons/DocIcons/Info.svg";

// AI 기능 사용 시 로딩 처리
const Skeleton = () => (
  <div className="animate-pulse space-y-3 w-full">
    <div className="h-4 bg-gray-200 rounded w-full" />
    <div className="h-4 bg-gray-300 rounded w-5/6" />
    <div className="h-4 bg-gray-200 rounded w-4/6" />
    <div className="h-4 bg-gray-300 rounded w-4/5" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
  </div>
);

const splitToSections = (text) => {
  const normalized = (text || "").replace(/\r/g, "");
  const parts = normalized
    .split(/\n(?=\s*(\d+[\.\)]|[①-⑳]|•|-)\s*)/g)
    .map((s) => s.replace(/^\s*(\d+[\.\)]|[①-⑳]|•|-)\s*/, "").trim())
    .filter(Boolean);
  return parts.length ? parts : [normalized];
};

export default function AiSummaryPanel({
  type, // AI 문법 or 문서 요약
  loading,
  content,
  onClose,
}) {
  const sections = useMemo(() => splitToSections(content), [content]);

  return (
    <aside className="h-full min-h-[240px] bg-white border-gray-200 flex flex-col font-[Livvic]">
      <div className="inline-flex flex-col items-stretch border-[#D9D9D9] bg-white h-full">
        {/* 헤더 */}

        <div className="flex flex-col items-start gap-[30px]">
          <button
            className="text-gray-500 hover:text-gray-700"
            title="닫기"
            onClick={onClose}
          >
            <img src={BackIcon} alt="Back" />
          </button>
          <div className="flex items-center gap-[9px] justify-center">
            <span className="text-gray-900 font-semibold text-[18px]">
              {type === "summary" ? "AI 요약" : "문법 수정 결과"}
            </span>
            <img
              src={InfoIcon}
              alt="Info"
              className="w-6 h-6 inline-block mt-[3px]"
            />
          </div>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto pt-4 mt-4 w-full">
          {loading ? (
            <Skeleton />
          ) : sections.length > 1 ? (
            <ol className="space-y-4">
              {sections.map((sec, i) => (
                <li key={i} className="flex gap-2">
                  <span className="min-w-5 h-5 inline-flex items-center justify-center text-xs font-bold rounded-full border border-gray-300">
                    {i + 1}
                  </span>
                  <div className="text-sm leading-6 text-gray-800">{sec}</div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm leading-6 text-gray-800 whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
