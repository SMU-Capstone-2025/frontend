import { useState, useEffect } from "react";
import { fetchDocumentList, deleteDocument } from "../api/documentApi";

// 문서 리스트 관리 로직
const useDoclist = (projectId) => {
  const [documents, setDocuments] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 문서 리스트 전체 불러오기
  useEffect(() => {
    const getDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchDocumentList(projectId);
        setDocuments(res);
      } catch (err) {
        setError("문서를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    getDocuments();
  }, [projectId]);

  // 검색 필터링
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchItem.toLowerCase())
  );

  // 로컬에서 즉시 리스트를 업데이트 -> UX 향상
  const addDocument = (newDoc) => {
    setDocuments((prevDocs) => [...prevDocs, { ...newDoc }]);
  };

  // 문서 삭제
  const removeDocument = async (documentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return {
    searchItem,
    setSearchItem,
    filteredDocuments,
    isLoading,
    error,
    addDocument,
    removeDocument,
    setDocuments,
    projectId,
  };
};

export default useDoclist;
