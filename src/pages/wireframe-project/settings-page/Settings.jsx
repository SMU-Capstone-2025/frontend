import React, { useEffect, useRef, useState } from "react";
import * as S from "./Settings.styled";
import ProjectInfo from "../../../components/settings-element/project-settings/ProjectInfo";
import MemberManager from "../../../components/settings-element/member-management/MemberManager";
import { fetchProject, updateProject } from "../../../api/projectApi";
import { useOutletContext } from "react-router-dom";
import { uploadFile } from "../../../api/taskApi";

const Settings = () => {
  const { projectId } = useOutletContext();
  const [projectName, setProjectName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [members, setMembers] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchProject(projectId);
        const { name, description, coworkers, imageId } = res.result;

        setProjectName(name);
        setProjectDescription(description);
        setCoverImage(imageId); // 커버 URL이 있다면 넣고, 없으면 유지

        setMembers(
          coworkers.map((user, idx) => ({
            id: idx + 1,
            name: user.name,
            email: user.email,
            role: user.role,
          }))
        );
      } catch (err) {
        console.error("프로젝트 정보 불러오기 실패", err);
      }
    };

    fetchData();
  }, [projectId]);

  const handleUpdateProject = async () => {
    try {
      let finalCoverImage = coverImage;

      if (coverImage?.startsWith?.("blob:")) {
        const file = fileInputRef.current?.files?.[0];

        if (file) {
          const uploaded = await uploadFile(file);
          finalCoverImage = uploaded.fileId;
        }
      }

      await updateProject(
        projectId,
        projectName,
        projectDescription,
        finalCoverImage
      );

      alert("프로젝트 정보가 저장되었습니다.");
    } catch (err) {
      alert("❌ 프로젝트 정보 저장 실패");
      console.error(err);
    }
  };
  return (
    <S.Container>
      <ProjectInfo
        projectName={projectName}
        setProjectName={setProjectName}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        onSave={handleUpdateProject}
        fileInputRef={fileInputRef}
      />
      <MemberManager
        projectId={projectId}
        members={members}
        setMembers={setMembers}
      />
    </S.Container>
  );
};

export default Settings;
