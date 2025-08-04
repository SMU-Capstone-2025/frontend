import React from "react";
import * as S from "./ProjectInfo.styled";
import ProjectCoverUploader from "./ProjectCover";
import ProjectMetaForm from "./ProjectMetaForm";

const ProjectInfo = ({
  projectName,
  setProjectName,
  coverImage,
  setCoverImage,
  projectDescription,
  setProjectDescription,
  onSave,
}) => {
  return (
    <S.InfoSection>
      <ProjectCoverUploader
        coverImage={coverImage}
        setCoverImage={setCoverImage}
      />
      <ProjectMetaForm
        projectName={projectName}
        setProjectName={setProjectName}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        onSave={onSave}
      />
    </S.InfoSection>
  );
};

export default ProjectInfo;
