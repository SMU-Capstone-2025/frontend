import React from "react";
import * as S from "./ProjectMetaForm.styled";

const ProjectMetaForm = ({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  onSave,
}) => {
  return (
    <S.TextInfoWrapper>
      <S.ProjectNameSection>
        <S.FormLabel>프로젝트 이름</S.FormLabel>
        <S.NameInputRow>
          <S.ProjectIcon>
            <span>P</span>
          </S.ProjectIcon>
          <S.ProjectNameInput
            placeholder="프로젝트 이름 입력"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </S.NameInputRow>
      </S.ProjectNameSection>

      <S.ProjectDetailSection>
        <S.FormLabel>프로젝트 설명</S.FormLabel>
        <S.ProjectDetailInput
          placeholder="프로젝트 설명 입력"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />
      </S.ProjectDetailSection>
      <S.ButtonWrapper>
        <S.SaveButton onClick={onSave}>저장</S.SaveButton>
      </S.ButtonWrapper>
    </S.TextInfoWrapper>
  );
};

export default ProjectMetaForm;
