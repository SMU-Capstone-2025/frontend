import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectListPreview = ({ projects, onCardClick }) => {
  return (
    <div className="grid grid-cols-2 gap-6 self-stretch">
      {projects.map((project, idx) => (
        <ProjectCard
          key={project.projectId || idx}
          keyNum={idx}
          project={project}
          onClick={() => onCardClick(project.projectId)}
        />
      ))}
    </div>
  );
};

export default ProjectListPreview;

// 기존 프로젝트 리스트를 불러오는 코드는 상위 컴포넌트에서
// 프로젝트를 상태로관리하고 props로 넘겨줌
// ProjectListPreview 컴포넌트는 UI 렌더링의 책임만 짐.
