import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./ProjectListPreview.styled";
import ProjectCard from "./ProjectCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const ProjectListPreview = ({ onFirstProjectId }) => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = (projectId) => {
    navigate(`/project/workboard/${projectId}`);
  };

  const projectPreview = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/project/list");
      console.log("프로젝트 리스트 배열:", res.data.result);
      setProjects(res.data.result);

      if (onFirstProjectId && res.data.result?.length > 0) {
        const first = res.data.result.find((p) => p.projectId);
        if (first) {
          onFirstProjectId(first.projectId);
        }
      }
    } catch (error) {
      console.log("프로젝트 불러오기 실패~!\n", error);
    }
  };

  useEffect(() => {
    projectPreview();
  }, []);

  return (
    <S.Container>
      {projects.map((project, idx) => (
        <ProjectCard
          key={idx}
          project={project}
          onClick={() => handleCardClick(project.projectId)}
        />
      ))}
    </S.Container>
  );
};

export default ProjectListPreview;
