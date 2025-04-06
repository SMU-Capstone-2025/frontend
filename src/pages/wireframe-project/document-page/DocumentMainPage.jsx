import { useState, useEffect, useRef } from "react";
import DocumentControl from "../../../components/document-element/common/DocumentControl";
import DocumentList from "../../../components/document-element/common/DocumentList";
import AddDocumentButton from "../../../components/document-element/create/AddDocumentButton";
import { useLocation } from "react-router-dom";
import { fetchDocuments } from "../../../api/documentApi.js";

const DocumentMainPage = () => {
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasAdded = useRef(false);

  useEffect(() => {
    const getDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDocuments();
        setDocuments(data);
      } catch (err) {
        setError("문서를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    getDocuments();
  }, []);

  // 새 문서 추가 (페이지에서 이동했을 경우)
  useEffect(() => {
    if (location.state && !hasAdded.current) {
      setDocuments((prev) => [...prev, location.state]);
      hasAdded.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchItem.toLowerCase())
  );

  const handleAddDocument = (newDoc) => {
    setDocuments((prevDocs) => [...prevDocs, { ...newDoc }]);
  };

  return (
    <div className="flex w-full max-w-[1280px] items-start flex-col gap-8 px-6 py-8 rounded-xl border border-gray-200 bg-white">
      {isLoading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <DocumentControl value={searchItem} onChange={setSearchItem} />
      <DocumentList documents={filteredDocuments} />
      <AddDocumentButton onAdd={handleAddDocument} />
    </div>
  );
};

export default DocumentMainPage;
