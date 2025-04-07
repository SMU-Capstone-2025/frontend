import DocumentItem from "./DocumentItem";
import ControlsAltOn from "../../../assets/icons/ControlsAlt/ControlsAltOn";

const DocumentList = ({ documents }) => {
  return (
    <div className="flex flex-col items-start gap-5 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="flex items-center gap-2.5">
          <span className="text-gray-400 text-sm font-semibold leading-[140%] tracking-[-0.14px] font-pretendard">
            전체 문서
          </span>
          <span className="text-gray-700 text-sm font-semibold leading-[140%] tracking-[-0.14px] font-pretendard">
            {documents.length}개
          </span>
        </span>
        <div className="flex items-center justify-center cursor-pointer hover:opacity-30 transition">
          <ControlsAltOn />
        </div>
      </div>
      <div className="flex flex-col items-start gap-3.5 w-full">
        {documents.length > 0 ? (
          documents.map((doc) => <DocumentItem key={doc.id} document={doc} />)
        ) : (
          <p className="text-gray-700 text-sm">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
