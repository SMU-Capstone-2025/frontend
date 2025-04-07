import React, { useState } from "react";
import MemberList from "./MemberList";
import AddMemberForm from "./AddMemberForm";
import * as S from "./MemberManager.styled";

const MemberManager = ({ members, setMembers }) => {
  const [newMember, setNewMember] = useState({
    email: "",
    role: "member",
  });

  const handleAddMember = () => {
    if (!newMember.email.trim()) return;
    setMembers([...members, { ...newMember, id: members.length + 1 }]);
    setNewMember({ email: "", role: "member" });
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
      <MemberList members={members} setMembers={setMembers} />
    </S.MembersSection>
  );
};

export default MemberManager;
