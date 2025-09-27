import React, { useState } from "react";
import MemberList from "./MemberList";
import AddMemberForm from "./AddMemberForm";
import { inviteMembersToProject } from "../../../api/projectApi";

const MemberManager = ({ projectId, members, setMembers }) => {
  const [newMember, setNewMember] = useState({
    email: "",
    role: "ROLE_MEMBER",
  });

  const handleAddMember = async () => {
    if (!newMember.email.trim()) return;

    try {
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
    const inviteLink = `${window.location.origin}/project/workboard/${projectId}`;
    navigator.clipboard.writeText(inviteLink);
    alert("초대 링크가 복사되었습니다!");
  };

  return (
    <div className="flex flex-col items-start w-full max-w-[628px] px-6 py-8 gap-6 rounded-xl border border-gray-200 bg-white">
      <span className="self-stretch text-gray-800 text-base font-bold leading-snug">
        멤버 관리
      </span>
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
    </div>
  );
};

export default MemberManager;
