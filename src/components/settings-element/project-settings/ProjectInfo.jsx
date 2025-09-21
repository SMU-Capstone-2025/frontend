import React from "react";
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
  projectId,
}) => {
  return (
    <div
      className="
        flex flex-col items-start
        w-[628px] rounded-xl border border-gray-200 bg-white
      "
    >
      <ProjectCoverUploader
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        projectId={projectId}
      />
      <ProjectMetaForm
        projectName={projectName}
        setProjectName={setProjectName}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        onSave={onSave}
      />
    </div>
  );
};

export default ProjectInfo;
