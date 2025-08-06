import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // idx 배열을 컴포넌트 함수 내에서 선언
  const idx = Array.from({ length: projects.length }, (_, i) => i);

  useEffect(() => {
    projectPreview();
  }, []);
  // console.log("프로젝트 리스트:", idx);

  return (
    <div className="grid grid-cols-2 gap-6 self-stretch ">
      {projects.map((project, idx) => (
        <ProjectCard
          key={idx}
          project={project}
          onClick={() => handleCardClick(project.projectId)}
        />
      ))}
    </div>
  );
};

export default ProjectListPreview;
