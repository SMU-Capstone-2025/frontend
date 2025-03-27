import * as S from "./DocumentControl.styled";
import { SearchIcon, ArrayIcon } from "../../assets/icons/index";

const DocumentControl = ({ value, onChange }) => {
  return (
    <S.ControlContainer>
      <S.SearchContainer>
        <S.SearchInput
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <S.IconWrapper>
          <SearchIcon />
        </S.IconWrapper>
      </S.SearchContainer>
      <ArrayIcon />
    </S.ControlContainer>
  );
};

export default DocumentControl;
