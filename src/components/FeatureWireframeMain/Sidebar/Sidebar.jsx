import React from "react";
import * as S from "./Sidebar.styled";

const Sidebar = () => {
  return (
    <S.Container>
      <S.HeaderWrapper>
        <S.HeaderText>project</S.HeaderText>
      </S.HeaderWrapper>
      <S.ProjectList>
        <S.ProjectWrapper>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <circle cx="15" cy="15" r="15" fill="#EDEDED" />
          </svg>
          <S.ProjectName>프로젝트 우하핳</S.ProjectName>
        </S.ProjectWrapper>
      </S.ProjectList>
    </S.Container>
  );
};

export default Sidebar;
