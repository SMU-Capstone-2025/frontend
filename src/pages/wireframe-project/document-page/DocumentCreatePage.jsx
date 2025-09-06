import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorContent } from "@tiptap/react";
import EditNavbar from "../../../components/document-element/create/edit-navbar/EditNavbar";
import useDocumentEditor from "../../../hooks/useDocumentEditor";
import useDocumentSocket from "../../../hooks/useDocumentSocket";
import useDocSync from "../../../hooks/useDocSync";
import useDocState from "../../../hooks/useDocState";
import { correctText, summarizeText } from "../../../api/documentApi";
import SummaryFloatingButton from "../../../components/document-element/common/SummaryFloatingButton";
import ProfileBlue from "../../../assets/icons/Profile/ProfileBlue";
import AiSummaryPanel from "../../../components/document-element/common/AiSummaryPanel";
import DocumentHistoryPanel from "../../../components/document-element/common/DocumentHistoryPannel";

const DocumentCreatePage = () => {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const { documentId, projectId } = useParams();
  const token = localStorage.getItem("token");
  const isEditMode = !!documentId;

  // 오른쪽 패널 상태 (요약 or 히스토리) 동시에 두 패널이 열리는 구조 방지
  const [rightPanel, setRightPanel] = useState(null);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryType, setSummaryType] = useState("summary");
  const [cursors, setCursors] = useState([]);
  const cursorsRef = useRef([]);
  useEffect(() => {
    cursorsRef.current = cursors;
  }, [cursors]);
  const editor = useDocumentEditor(cursorsRef); // tiptap 에디터 생성

  const {
    title,
    setTitle,
    status,
    setStatus,
    isLoading,
    autoSaveAndBack,
    updateTime,
    editors,
  } = useDocState({
    editor,
    documentId,
    projectId,
    navigate,
    isEditMode,
  });

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
    setRightPanel("summary"); // 요약 패널 열기
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
    setRightPanel("summary"); // 문법 수정 패널 열기
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

  // 실시간 협업 소켓
  const { connect, disconnect, sendMessage } = useDocumentSocket({
    token,
    documentId,
    onMessage: (data) => {
      console.log("서버 수신 data:", data);
      console.log("cursor:", data.cursor);

      const myEmail = localStorage.getItem("email");

      if (!editor || !data?.content) return;

      if (data.title && data.title !== titleRef.current) {
        setTitle(data.title);
      }

      const current = editor.getHTML().trim();
      const incoming = data.content.trim();
      if (current !== incoming && !isTypingRef.current) {
        editor.commands.setContent(incoming, false);
      }

      if (data.user?.userEmail !== myEmail) {
        setCursors((prev) => {
          const newState = [
            ...prev.filter((c) => c.user.userEmail !== data.user.userEmail),
            { user: data.user, cursor: data.cursor },
          ];
          console.log("setCursors:", newState);
          return newState;
        });
      } else {
        console.log("본인 커서 무시");
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
      const selection = editor.state.selection;
      sendMessage({
        ...payload,
        title: titleRef.current,
        cursor: {
          from: selection.from,
          to: selection.to,
        },
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
        editors={editors}
        documentId={documentId}
        onHistoryClick={() => setRightPanel("history")}
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
            className="w-full text-gray-800 font-bold p-2 text-[28px] border border-transparent rounded-md focus:outline-none focus:border-gray-300 transition"
            placeholder="제목 없음"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {isLoading ? (
            <div className="text-gray-400 text-[20px] p-6">문서 저장 중...</div>
          ) : (
            <div className="w-full border border-transparent rounded-md focus-within:border-gray-300 transition">
              <EditorContent
                editor={editor}
                className="text-gray-800 text-[14px] p-2 focus:outline-none focus:ring-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽 패널 */}
      {rightPanel === "summary" && (
        <div
          className="absolute top-[151px] right-0 w-[520px] h-[calc(100%-151px)]
              border-l border-gray-200 bg-white 
              flex flex-col p-[26px] overflow-y-auto z-50"
        >
          <AiSummaryPanel
            type={summaryType}
            loading={isSummarizing}
            content={summary}
            onClose={() => setRightPanel(null)}
            onApplyCorrection={() => {
              editor?.commands.setContent(summary);
              setRightPanel(null);
            }}
          />
        </div>
      )}

      {rightPanel === "history" && (
        <div
          className="absolute top-[151px] right-0 w-[520px] h-[calc(100%-151px)]
            border-l border-gray-200 bg-white 
            flex flex-col overflow-y-auto z-50"
        >
          <DocumentHistoryPanel
            documentId={documentId}
            onClose={() => setRightPanel(null)}
          />
        </div>
      )}

      <SummaryFloatingButton
        visible={rightPanel === null} // 패널이 없을 경우 -> 플로팅 버튼 추가
        onSummaryClick={handleSummary}
        onCorrectClick={handleCorrect}
      />
    </div>
  );
};

export default DocumentCreatePage;
