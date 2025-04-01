import DocumentItem from "./DocumentItem";
import * as S from "./DocumentList.styled.js";

const DocumentList = ({ documents }) => {
  return (
    <S.DocumentListWrapper>
      <S.DocumentCount>총 문서 개수: {documents.length}개</S.DocumentCount>
      {documents.length > 0 ? (
        documents.map((doc) => <DocumentItem key={doc.id} document={doc} />)
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </S.DocumentListWrapper>
  );
};

export default DocumentList;
