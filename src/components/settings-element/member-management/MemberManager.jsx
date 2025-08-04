import React, { useState } from "react";
import MemberList from "./MemberList";
import AddMemberForm from "./AddMemberForm";
import * as S from "./MemberManager.styled";
import { inviteMembersToProject } from "../../../api/projectApi";

const MemberManager = ({ projectId, members, setMembers }) => {
  const [newMember, setNewMember] = useState({
    email: "",
    role: "ROLE_MEMBER",
  });

  const handleAddMember = async () => {
    if (!newMember.email.trim()) return;

    try {
      // 실제 서버 초대 요청 보내기
      await inviteMembersToProject({
        projectId,
        email: newMember.email,
      });

      alert("초대 이메일이 전송됐습니다!");

      setNewMember({ email: "", role: "ROLE_MEMBER" });
    } catch (err) {
      alert("멤버 초대에 실패했습니다.");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setNewMember({ ...newMember, email: e.target.value });
  };

  const handleCopyInviteLink = () => {
    const inviteLink = "www.링크예시.com";
    navigator.clipboard.writeText(inviteLink);
    alert("초대 링크가 복사되었습니다!");
  };

  return (
    <S.MembersSection>
      <S.Label>멤버 관리</S.Label>
      <AddMemberForm
        email={newMember.email}
        onChange={handleInputChange}
        onAdd={handleAddMember}
        onCopyLink={handleCopyInviteLink}
      />
      <MemberList
        projectId={projectId}
        members={members}
        setMembers={setMembers}
      />
    </S.MembersSection>
  );
};

export default MemberManager;
