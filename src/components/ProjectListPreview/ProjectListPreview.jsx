import React, { useEffect, useState } from "react";
import * as S from "./ProjectListPreview.styled";
import ProjectCard from "./ProjectCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const ProjectListPreview = ({ onFirstProjectId }) => {
  const [projects, setProjects] = useState([]);

  const projectPreview = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/project/list");
      setProjects(res.data.result);
      // 첫 번째 유효한 projectId를 상위로 전달
      if (onFirstProjectId && res.data.result && res.data.result.length > 0) {
        const firstValidProject = res.data.result.find(
          (proj) => proj.projectId
        );
        if (firstValidProject) {
          onFirstProjectId(firstValidProject.projectId);
          console.log("첫 번째 프로젝트 ID:", firstValidProject.projectId);
        }
      }
      return res;
    } catch (error) {
      console.log("프로젝트 불러오기 실패~!\n", error);
      return error;
    }
  };

  // idx 배열을 컴포넌트 함수 내에서 선언
  const idx = Array.from({ length: projects.length }, (_, i) => i);

  useEffect(() => {
    projectPreview();
  }, []);
  // console.log("프로젝트 리스트:", idx);

  return (
    <S.Container>
      {projects.map((project) => (
        <ProjectCard key={project.projectId} project={project} />
      ))}
    </S.Container>
  );
};

export default ProjectListPreview;
