import { useState } from "react";
import DocumentAddItem from "../../../components/document-element/DocumentAddItem";
import DocumentControl from "../../../components/document-element/DocumentControl";
import DocumentList from "../../../components/document-element/DocumentList";
import * as S from "./Document.styled";

const dummyDocuments = [
  {
    id: 1,
    title: "진행 전 문서",
    preview: "이 문서는 예제입니다.",
    updatedAt: "2025-03-16",
    status: "진행 전",
  },
  {
    id: 2,
    title: "진행 중 문서",
    preview: "문서 관리 시스템을 만들고 있습니다.",
    updatedAt: "2025-03-15",
    status: "진행 중",
  },
  {
    id: 3,
    title: "완료 문서",
    preview: "React와 Styled Components를 활용합니다.",
    updatedAt: "2025-03-14",
    status: "완료",
  },
];
// Document.jsx: 전체 데이터와 상태를 관리
const Document = () => {
  const [documents, setDocuments] = useState(dummyDocuments);
  const [searchItem, setSearchItem] = useState("");

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchItem.toLowerCase())
  );

  const handleAddDocument = (newDoc) => {
    setDocuments((prevDocs) => [...prevDocs, { ...newDoc }]);
  };

  return (
    <S.DocumentContainer>
      <DocumentControl value={searchItem} onChange={setSearchItem} />
      <DocumentAddItem onAdd={handleAddDocument} />
      <DocumentList documents={filteredDocuments} />
    </S.DocumentContainer>
  );
};

export default Document;
