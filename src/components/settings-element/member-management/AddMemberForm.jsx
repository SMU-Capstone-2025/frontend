import React from "react";
import LinkOn from "../../../assets/icons/Link/LinkOn";
import PlusOn from "../../../assets/icons/Plus/PlusOn";
import * as S from "./AddMemberForm.styled";

const AddMemberForm = ({ email, onChange, onAdd, onCopyLink }) => {
  return (
    <S.MemberAddWrapper>
      <S.MemberAddInputWrapper>
        <S.MemberAddInput
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={onChange}
        />
      </S.MemberAddInputWrapper>
      <S.MemberAddButtonWrapper>
        <S.AddLinkButton title="초대 링크 복사" onClick={onCopyLink}>
          <LinkOn />
        </S.AddLinkButton>
        <S.AddMemberButton title="멤버 추가" onClick={onAdd}>
          <PlusOn color="#fff" />
          <span>멤버 추가</span>
        </S.AddMemberButton>
      </S.MemberAddButtonWrapper>
    </S.MemberAddWrapper>
  );
};

export default AddMemberForm;
