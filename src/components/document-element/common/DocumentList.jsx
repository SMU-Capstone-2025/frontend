import DocumentItem from "./DocumentItem";
import ControlsAltOn from "../../../assets/icons/ControlsAlt/ControlsAltOn";
import { fetchDocumentsByDateAsc } from "../../../api/projectApi";
import { useState } from "react";

const DocumentList = ({ projectId, setDocuments, documents, onDelete }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleLoadSortedDocs = async () => {
    try {
      const sortedList = await fetchDocumentsByDateAsc(projectId);
      setDocuments(sortedList);
    } catch (err) {
      console.error("📛 정렬된 문서 목록 불러오기 실패", err);
    }
  };
  return (
    <div className="flex flex-col items-start gap-5 w-full font-[Livvic]">
      <div className="flex items-center justify-between w-full">
        <span className="flex items-center gap-2.5">
          <span className="text-gray-400 text-sm font-semibold leading-[140%] tracking-[-0.14px] font-pretendard">
            전체 문서
          </span>
          <span className="text-gray-700 text-sm font-semibold leading-[140%] tracking-[-0.14px] font-pretendard">
            {documents.length}개
          </span>
        </span>
        <div
          className="flex items-center justify-center transition cursor-pointer hover:opacity-30"
          onClick={handleLoadSortedDocs}
        >
          <ControlsAltOn />
        </div>
      </div>
      <div className="flex flex-col items-start gap-3.5 w-full">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <DocumentItem
              key={doc.id}
              document={doc}
              onDelete={onDelete}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              projectId={projectId}
            />
          ))
        ) : (
          <p className="text-sm text-gray-700">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
