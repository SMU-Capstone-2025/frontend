import React, { useEffect, useState } from "react";
import * as S from "./ProjectListPreview.styled";
import ProjectCard from "./ProjectCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const ProjectListPreview = () => {
  const [projects, setProjects] = useState([]);
  const projectPreview = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/project/list");
      console.log("프로젝트 불러오기 성공~!\n", res);
      setProjects(res.data.result);
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
