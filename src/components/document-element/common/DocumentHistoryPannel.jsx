import React, { useEffect, useState } from "react";
import BackIcon from "../../../assets/icons/DocIcons/Back.svg";
import InfoIcon from "../../../assets/icons/DocIcons/Info.svg";
import { fetchDocumentLogs } from "../../../api/documentApi";

export default function DocumentHistoryPanel({ documentId, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await fetchDocumentLogs(documentId, 1, 10);
        setLogs(res.content || []);
      } catch (err) {
        console.error("히스토리 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [documentId]);

  // 날짜 포맷 함수
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    date.setHours(date.getHours() + 9); // 9시간 추가

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  // 문단 단위로 split
  const splitParagraphs = (html) => {
    const doc = new DOMParser().parseFromString(html || "", "text/html");
    const paragraphs = Array.from(doc.querySelectorAll("p"));
    return paragraphs.map((p) => p.textContent?.trim() || "").filter(Boolean);
  };

  // 문단 단위 diff 렌더링
  const renderParagraphDiff = (oldHtml, newHtml) => {
    const oldParas = splitParagraphs(oldHtml);
    const newParas = splitParagraphs(newHtml);

    const maxLen = Math.max(oldParas.length, newParas.length);
    const blocks = [];

    for (let i = 0; i < maxLen; i++) {
      const oldP = oldParas[i];
      const newP = newParas[i];

      if (oldP && !newP) {
        // 삭제된 문단
        blocks.push(
          <div
            key={`old-${i}`}
            className="p-3 rounded-[6px] text-[#C9CBCE] text-sm font-normal line-through"
          >
            {oldP}
          </div>
        );
      } else if (!oldP && newP) {
        // 새로 추가된 문단
        blocks.push(
          <div
            key={`new-${i}`}
            className="p-3 rounded-[6px] bg-[#F3F4F6] text-gray-800 text-sm font-normal"
          >
            {newP}
          </div>
        );
      } else if (oldP && newP && oldP !== newP) {
        // 수정된 문단 -> 삭제 블록 + 추가 블록 렌더링
        blocks.push(
          <div
            key={`old-${i}`}
            className="p-3 rounded-[6px] text-[#C9CBCE] text-sm font-normal line-through"
          >
            {oldP}
          </div>
        );
        blocks.push(
          <div
            key={`new-${i}`}
            className="p-3 rounded bg-[#F3F4F6] text-[#1F2937] text-sm font-normal"
          >
            {newP}
          </div>
        );
      } else if (oldP && newP && oldP === newP) {
        // 그대로인 문단은 표시 X
        continue;
      }
    }

    return blocks;
  };

  return (
    <div className="h-full min-h-[240px] bg-white border-gray-200 flex flex-col font-[Livvic] p-[26px]">
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
          <div className="flex items-center gap-[9px] justify-center pb-[18px]">
            <span className="text-[#111827] font-semibold text-[20px]">
              History
            </span>
            <img src={InfoIcon} alt="Info" className="pt-[3px]" />
          </div>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto space-y-[24px]">
          {loading ? (
            <p className="text-sm text-gray-400">불러오는 중...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-gray-500">히스토리 없음</p>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 pr-2">
                {/* 사용자 아이콘 */}
                <div className="w-6 h-6 rounded-full bg-[#D5E8FC] flex items-center justify-center text-[13px] font-semibold text-blue-400">
                  {log.email?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* 내용 */}
                <div className="flex-1 space-y-2">
                  {/* 상단: 이메일 + 시간 */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-semibold text-gray-800">
                      {log.userName}
                    </span>
                    <span className="text-[12px] text-[#9CA3AF]">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>

                  {/* 변경 사항 */}
                  <div>
                    {renderParagraphDiff(
                      log.oldContent?.content,
                      log.newContent?.content
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
