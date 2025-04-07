import React from "react";
import * as S from "./ProjectListPreview.styled";
import ProjectCard from "./ProjectCard";

const ProjectListPreview = () => {
  return (
    <S.Container>
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
    </S.Container>
  );
};

export default ProjectListPreview;
