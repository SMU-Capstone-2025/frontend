import React, { useState } from "react";
import * as S from "./Settings.styled";
import ProjectInfo from "../../../components/settings-element/project-settings/ProjectInfo";
import MemberManager from "../../../components/settings-element/member-management/MemberManager";

const dummyUser = [
  {
    id: 1,
    name: "사용자",
    email: "username1@gmail.com",
    role: "owner",
  },
];

const Settings = () => {
  const [projectName, setProjectName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [members, setMembers] = useState(dummyUser);

  return (
    <S.Container>
      <ProjectInfo
        projectName={projectName}
        setProjectName={setProjectName}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
      />
      <MemberManager members={members} setMembers={setMembers} />
    </S.Container>
  );
};

export default Settings;
