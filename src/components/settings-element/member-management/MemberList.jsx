import React from "react";
import CloseOn from "../../../assets/icons/Close/CloseOn";
import PersonOn from "../../../assets/icons/Person/PersonOn";
import {
  fetchProject,
  updateProjectAuthorities,
  removeProjectUser,
} from "../../../api/projectApi";

const MemberList = ({ projectId, members, setMembers }) => {
  // 강퇴
  const handleRemove = async (email) => {
    const confirmDelete = window.confirm(
      `${email} 님을 정말 프로젝트에서 강퇴하시겠습니까?`
    );
    if (!confirmDelete) return; // 취소하면 종료

    try {
      await removeProjectUser(projectId, email);

      // 최신 멤버 목록 갱신
      const res = await fetchProject(projectId);
      const { coworkers } = res.result;

      setMembers(
        coworkers.map((user, idx) => ({
          id: idx + 1,
          name: user.name,
          email: user.email,
          role: user.role,
        }))
      );
    } catch (err) {
      alert("강퇴 실패");
      console.error(err);
    }
  };

  // 권한 변경
  const handleRoleChange = async (id, newRole) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;

    try {
      // 권한 변경 요청(단일 객체로 해야 함)
      await updateProjectAuthorities(projectId, target.email, newRole);

      // 최신 프로젝트 정보로 멤버 목록 다시 불러오기
      const res = await fetchProject(projectId);
      const { coworkers } = res.result;

      setMembers(
        coworkers.map((user, idx) => ({
          id: idx + 1,
          name: user.name,
          email: user.email,
          role: user.role,
        }))
      );
      alert("유저의 권한이 변경됐습니다!");
    } catch (err) {
      alert("권한 변경 실패");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      {members.map((member) => {
        const {
          id,
          name = "user00",
          email = "user00@example.com",
          role = "ROLE_MEMBER",
        } = member;

        return (
          <div key={id} className="flex justify-between items-center w-full">
            {/* 왼쪽 - 아바타 + 정보 */}
            <div className="flex items-center gap-2">
              <div
                className={`flex w-8 h-8 items-center justify-center rounded-full border border-white ${
                  id % 2 === 0 ? "bg-yellow-100" : "bg-blue-100"
                }`}
              >
                <PersonOn color={id % 2 === 0 ? "#FACC15" : "#5BA7F7"} />
              </div>

              <div className="flex flex-col items-start justify-center gap-0.5">
                <p className="text-gray-800 text-xs font-bold leading-snug">
                  {name}
                </p>
                <p className="text-gray-800 text-xs opacity-50 leading-snug">
                  {email}
                </p>
              </div>
            </div>

            {/* 오른쪽 - 권한 선택 + 강퇴 */}
            <div className="flex items-center gap-5">
              <select
                value={role}
                onChange={(e) => handleRoleChange(id, e.target.value)}
                className="border-none text-sm cursor-pointer focus:outline-none"
              >
                <option value="ROLE_MANAGER">Owner</option>
                <option value="ROLE_MEMBER">Member</option>
              </select>
              <button
                onClick={() => handleRemove(email)}
                className="w-4 h-4 bg-transparent border-none cursor-pointer"
              >
                <CloseOn />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MemberList;
