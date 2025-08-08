import { useState, useEffect } from "react";
import { createDocument, fetchDocumentById } from "../api/documentApi";

// 문서 불러오기 + 문서 상태 관리 + 저장로직
const useDocState = ({
  editor,
  documentId,
  projectId: initialProjectId,
  navigate,
}) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState(initialProjectId);

  useEffect(() => {
    if (!documentId || !editor) return;

    const load = async () => {
      try {
        const data = await fetchDocumentById(documentId);
        setTitle(data.title);
        setStatus(data.status);
        setProjectId(data.projectId); // 수정 시에도 projectId 확보
        editor.commands.setContent(data.content);
      } catch (err) {
        alert("문서 불러오기 실패");
      }
    };

    load();
  }, [documentId, editor]);

  const autoSaveAndBack = async () => {
    const content = editor?.getHTML()?.trim();
    const trimmedTitle = title.trim();

    if (!editor || !content || content === "<p></p>" || trimmedTitle === "") {
      navigate(`/project/document/${projectId}`);
      return;
    }

    if (!documentId) {
      try {
        console.log("문서 생성시 프로젝트 id", projectId);
        setIsLoading(true);
        await createDocument({
          projectId,
          content,
          title: trimmedTitle,
          status,
          attachments: [],
        });
      } catch (err) {
        alert("문서 생성 실패: " + err.message);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    navigate(`/project/document/${projectId}`);
  };

  return {
    title,
    setTitle,
    status,
    setStatus,
    isLoading,
    autoSaveAndBack,
  };
};

export default useDocState;
