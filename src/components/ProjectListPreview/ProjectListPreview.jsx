import React, { useEffect, useState } from "react";
import * as S from "./ProjectListPreview.styled";
import ProjectCard from "./ProjectCard";
import { axiosInstanceWithHeader } from "../../apis/axiosInstance";

const ProjectListPreview = () => {
  const [projects, setProjects] = useState([]);
  const projectPreview = async () => {
    try {
      const res = await axiosInstanceWithHeader.get(
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
      <ProjectCard id="0" />
      <ProjectCard id="1" />
      <ProjectCard id="2" />
      <ProjectCard id="3" />
      <ProjectCard id="4" />
      {/* <ProjectCard id="5" />
      <ProjectCard id="6" />
      <ProjectCard id="7" />
      <ProjectCard id="8" />
      <ProjectCard id="9" />
      <ProjectCard id="10" />
      <ProjectCard id="11" />
      <ProjectCard id="12" />
      <ProjectCard id="13" />
      <ProjectCard id="14" />
      <ProjectCard id="15" />
      <ProjectCard id="16" />
      <ProjectCard id="16" />
      <ProjectCard id="17" />
      <ProjectCard id="18" />
      <ProjectCard id="19" />
      <ProjectCard id="20" />
      <ProjectCard id="21" />
      <ProjectCard id="22" />
      <ProjectCard id="23" />
      <ProjectCard id="24" />
      <ProjectCard id="25" /> */}
    </S.Container>
  );
};

export default ProjectListPreview;
