import React from "react";
import * as S from "./MemberList.styled";
import CloseOn from "../../../assets/icons/Close/CloseOn";
import PersonOn from "../../../assets/icons/Person/PersonOn";
const MemberList = ({ members, setMembers }) => {
  const handleRoleChange = (id, newRole) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, role: newRole } : member
      )
    );
  };

  const handleRemove = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <S.ListSection>
      {members.map((member) => {
        // 우선 기본 값으로 생성
        const { id, name = "example", email = "", role = "member" } = member;
        return (
          <S.MemberWrapper key={id}>
            <S.MemberSection>
              <S.Avatar>
                <PersonOn />
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
                <option value="owner">Owner</option>
                <option value="member">Member</option>
              </S.SelectRole>
              <S.RemoveButton onClick={() => handleRemove(id)}>
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
