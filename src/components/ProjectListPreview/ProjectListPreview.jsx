import React, { useEffect, useState } from "react";
import * as S from "./ProjectListPreview.styled";
import ProjectCard from "./ProjectCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const ProjectListPreview = ({ onFirstProjectId }) => {
  const [projects, setProjects] = useState([]);

  const projectPreview = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/project/list");
      console.log("프로젝트 불러오기 성공~!\n", res);
      setProjects(res.data.result);
      // 첫 번째 프로젝트 id를 상위로 전달
      if (onFirstProjectId && res.data.result && res.data.result.length > 0) {
        for (let i = 0; i < res.data.result.length; i++) {
          if (res.data.result[i].projectId) {
            onFirstProjectId(res.data.result[i].projectId);
            console.log("첫 번째 프로젝트 ID:", res.data.result[i].projectId);
            break; // 첫 번째 유효한 projectId 찾기
          }
        }
      }
      return res;
    } catch (error) {
      console.log("프로젝트 불러오기 실패~!\n", error);
      return error;
    }
  };

  useEffect(() => {
    projectPreview();
  }, []);

  return (
    <S.Container>
      {projects.map((project, idx) => (
        <ProjectCard key={idx} project={project} />
      ))}
    </S.Container>
  );
};

export default ProjectListPreview;
