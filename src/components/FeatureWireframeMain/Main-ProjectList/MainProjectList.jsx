import React from "react";
import * as S from "./MainProjectList.styled";
import MainProjectListCard from "./MainProjectListCard";

const MainProjectList = () => {
  const projectMockData = [
    { id: 1, title: "프로젝트1", description: "프로젝트1 설명" },
    { id: 2, title: "프로젝트2", description: "프로젝트2 설명" },
    { id: 3, title: "프로젝트3", description: "프로젝트3 설명" },
    { id: 4, title: "프로젝트4", description: "프로젝트4 설명" },
  ];

  return (
    <S.Container>
      <S.ContainerText>프로젝트</S.ContainerText>
      <S.ProjectPreviewCardList>
        {projectMockData.map((project) => (
          <MainProjectListCard
            key={project.id}
            project={project.title}
            description={project.description}
          />
        ))}
      </S.ProjectPreviewCardList>
    </S.Container>
  );
};

export default MainProjectList;
