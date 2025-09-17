import React from "react";
import * as S from "./MemberList.styled";
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
    } catch (err) {
      alert("❌ 권한 변경 실패");
      console.error(err);
    }
  };

  return (
    <S.ListSection>
      {members.map((member) => {
        // 우선 기본 값으로 생성
        const {
          id,
          name = "user00",
          email = "user00@example.com",
          role = "ROLE_MEMBER",
        } = member;

        return (
          <S.MemberWrapper key={id}>
            <S.MemberSection>
              <S.Avatar className={id % 2 === 0 ? "yellow" : "blue"}>
                <PersonOn color={id % 2 === 0 ? "#FACC15" : "#5BA7F7"} />
              </S.Avatar>
              <S.MemberInfo>
                <S.MemberName>{name}</S.MemberName>
                <S.MemberEmail>{email}</S.MemberEmail>
              </S.MemberInfo>
            </S.MemberSection>

            <S.MemberEditBlock>
              <S.SelectRole
                value={role}
                onChange={(e) => handleRoleChange(id, e.target.value)}
              >
                <option value="ROLE_MANAGER">Owner</option>
                <option value="ROLE_MEMBER">Member</option>
              </S.SelectRole>
              {/* 강퇴 버튼 */}
              <S.RemoveButton onClick={() => handleRemove(email)}>
                <CloseOn />
              </S.RemoveButton>
            </S.MemberEditBlock>
          </S.MemberWrapper>
        );
      })}
    </S.ListSection>
  );
};

export default MemberList;
