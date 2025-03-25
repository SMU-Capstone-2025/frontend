import React from "react";
import * as S from "./MainProjectList.styled";
import MainProjectListCard from "./MainProjectListCard";

const MainProjectList = () => {
  return (
    <S.Container>
      <S.ContainerText>프로젝트</S.ContainerText>
      <S.ProjectPreviewCardList>
        <MainProjectListCard />
        <MainProjectListCard />
        <MainProjectListCard />
      </S.ProjectPreviewCardList>
    </S.Container>
  );
};

export default MainProjectList;
