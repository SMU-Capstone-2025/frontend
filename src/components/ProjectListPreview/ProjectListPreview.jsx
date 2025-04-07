import React, { useEffect, useState } from "react";
import * as S from "./ProjectListPreview.styled";
import ProjectCard from "./ProjectCard";
import { axiosInstance } from "../../apis/axiosInstance";

const ProjectListPreview = () => {
  const [projects, setProjects] = useState([]);
  const projectPreview = async () => {
    try {
      const res = await axiosInstance.get(
        "/project/load?projectId=67d577c26a391f168de94d08"
      );
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
      <ProjectCard id="1" />
      <ProjectCard id="2" />
      <ProjectCard id="3" />
    </S.Container>
  );
};

export default ProjectListPreview;
