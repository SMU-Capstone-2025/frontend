import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorContent } from "@tiptap/react";
import EditNavbar from "../../../components/document-element/create/edit-navbar/EditNavbar";
import useDocumentEditor from "../../../hooks/useDocumentEditor";
import useDocumentSocket from "../../../hooks/useDocumentSocket";
import useDocSync from "../../../hooks/useDocSync";
import useDocState from "../../../hooks/useDocState";
import {
  correctText,
  reviseSummary,
  summarizeText,
} from "../../../api/documentApi";
import SummaryFloatingButton from "../../../components/document-element/common/SummaryFloatingButton";
import ProfileBlue from "../../../assets/icons/Profile/ProfileBlue";
import AiSummaryPanel from "../../../components/document-element/common/AiSummaryPanel";

const DocumentCreatePage = () => {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const { documentId, projectId } = useParams();
  const token = localStorage.getItem("token");
  const isEditMode = !!documentId;
  const [summary, setSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryType, setSummaryType] = useState("summary");

  const editor = useDocumentEditor(); // tiptap 에디터 생성

  const {
    title,
    setTitle,
    status,
    setStatus,
    isLoading,
    autoSaveAndBack,
    updateTime,
  } = useDocState({ editor, documentId, projectId, navigate, isEditMode });

  // 날짜 포맷 함수
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // 서버 시간과 맞추기 위해 9시간 더해줘야 함
    date.setHours(date.getHours() + 9);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  // 소켓 전송 시 최신 제목
  const titleRef = useRef(title);
  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  const stripHtml = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  // AI 요약 기능
  const handleSummary = async () => {
    if (!editor) return;
    setSummaryType("summary");
    setShowSummary(true);
    setIsSummarizing(true);
    try {
      const content = editor.getHTML();
      const result = await summarizeText({ request: content });
      const plainText = stripHtml(result.response);
      setSummary(plainText);
    } catch {
      alert("요약 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // 문법 수정 기능
  const handleCorrect = async () => {
    if (!editor) return;
    setSummaryType("correction");
    setShowSummary(true);
    setIsSummarizing(true);
    try {
      const content = editor.getHTML();
      const result = await correctText({ request: content });
      const plainText = stripHtml(result.response);
      setSummary(plainText);
    } catch {
      alert("문법 수정 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // const handleRevise = async () => {
  //   const originSummary = summary;
  //   const reviseRequest = prompt("수정 방향을 입력해주세요 (예: 더 간결하게)");
  //   if (!reviseRequest) return;
  //   try {
  //     const result = await reviseSummary({
  //       request: originSummary,
  //       reviseRequest,
  //     });
  //     const plain = stripHtml(result.response);
  //     setSummary(plain);
  //   } catch {
  //     alert("요약 재수정 요청 중 오류가 발생했습니다.");
  //   }
  // };

  // 실시간 협업 소켓
  const { connect, disconnect, sendMessage } = useDocumentSocket({
    token,
    documentId,
    onMessage: (data) => {
      if (!editor || !data?.content) return;
      if (data.title && data.title !== titleRef.current) {
        setTitle(data.title);
      }
      // 제목 동기화
      const current = editor.getHTML().trim();
      const incoming = data.content.trim();
      // 본문 동기화(내가 타이핑 중 아닐 때만 덮어 씌움)
      if (current !== incoming && !isTypingRef.current) {
        editor.commands.setContent(incoming, false);
      }
    },
  });

  // 타이핑 중인지 체크
  const { isTypingRef } = useDocSync(editor, {
    title,
    status,
    documentId,
    sendMessage: (payload) => {
      // 디바운스된 전송 함수 내부에서 항상 최신 제목으로 관리
      sendMessage({
        ...payload,
        title: titleRef.current,
      });
    },
  });

  useEffect(() => {
    if (!isEditMode) return; // 새 문서 작성이면 소켓 열지 않음
    connect();
    return () => disconnect();
  }, [isEditMode, documentId]);

  return (
    <div className="bg-gray-50 h-screen flex flex-col relative">
      <EditNavbar
        title={title}
        onTitleChange={setTitle}
        onBack={autoSaveAndBack}
        editor={editor}
        status={status}
        onStatusChange={setStatus}
        onSummaryClick={handleSummary}
        onCorrectClick={handleCorrect}
      />

      {/* 문서 본문 영역 */}
      <div className="flex-grow w-full h-[calc(100%-80px)] flex justify-center bg-white px-4 py-8 overflow-auto">
        <div className="w-full max-w-[768px] flex flex-col gap-4 font-[Livvic]">
          <div className="flex items-center justify-start gap-7">
            <div className="flex items-center gap-2">
              <ProfileBlue />
              <span className="text-gray-800 font-semibold text-[14px] leading-[150%]">
                {userName}
              </span>
            </div>
            <span className="text-gray-400 text-[14px] leading-[150%] font-[Palanquin]">
              업데이트 시간: {formatDateTime(updateTime) || "불러오는 중..."}
            </span>
          </div>

          <input
            className="text-gray-800 font-bold text-[28px]"
            placeholder="제목 없음"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {isLoading ? (
            <div className="text-gray-400 text-[20px] p-6">문서 저장 중...</div>
          ) : (
            <EditorContent
              editor={editor}
              className="text-gray-800 text-[14px]"
            />
          )}
        </div>
      </div>

      {/* 오른쪽 패널 */}
      {showSummary && (
        <div
          className="absolute top-[151px] right-0 w-[520px] h-[calc(100%-151px)]
              border-l border-gray-200 bg-white 
              flex flex-col p-[26px] overflow-y-auto z-50"
        >
          <AiSummaryPanel
            type={summaryType}
            loading={isSummarizing}
            content={summary}
            onClose={() => setShowSummary(false)}
            // onCopy={() => {
            //   navigator.clipboard.writeText(summary);
            //   alert("복사되었습니다!");
            // }}
            // onRevise={handleRevise}
            onApplyCorrection={() => {
              editor?.commands.setContent(summary);
              setShowSummary(false);
            }}
          />
        </div>
      )}

      <SummaryFloatingButton
        visible={!showSummary}
        onSummaryClick={handleSummary}
        onCorrectClick={handleCorrect}
      />
    </div>
  );
};

export default DocumentCreatePage;
