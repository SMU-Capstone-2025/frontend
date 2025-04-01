import { DrawerIcon } from "../../assets/icons/index";
import * as S from "./DocumentItem.styled";

const DocumentItem = ({ document, onDelete }) => {
  return (
    <S.ItemContainer>
      <S.InfoContainer>
        <S.Title>{document.title}</S.Title>
        <S.PreviewText>{document.preview}</S.PreviewText>
      </S.InfoContainer>
      <S.RightContainer>
        <S.StatusBadge $status={document.status}>
          {document.status}
        </S.StatusBadge>
        <S.DateText>{document.updatedAt}</S.DateText>
        <DrawerIcon />
      </S.RightContainer>
    </S.ItemContainer>
  );
};

export default DocumentItem;
