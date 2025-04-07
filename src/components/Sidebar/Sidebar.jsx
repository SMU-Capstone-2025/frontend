import React from "react";
import * as S from "./Sidebar.styled";
import PlusOff from "../../assets/icons/Plus/PlusOff";
import ArrowRightOff from "../../assets/icons/ArrowRight/ArrowRightOff";

const Sidebar = () => {
  return (
    <S.Container>
      <S.ProjectContainer>
        <S.ProjectHeader>
          <S.HeaderText>Project</S.HeaderText>
          <PlusOff />
        </S.ProjectHeader>
        <S.ProjectList>
          <S.ProjectListContent>
            <S.ProjectHeaderIcon>P</S.ProjectHeaderIcon>
            <S.ProjectName>Project: Z</S.ProjectName>
          </S.ProjectListContent>
          <S.ProjectListContent>
            <S.ProjectHeaderIcon>P</S.ProjectHeaderIcon>
            <S.ProjectName>Project: Z</S.ProjectName>
          </S.ProjectListContent>
          <S.ProjectListContent>
            <S.ProjectHeaderIcon>P</S.ProjectHeaderIcon>
            <S.ProjectName>Project: Z</S.ProjectName>
          </S.ProjectListContent>
          <S.ProjectListContent>
            <S.ProjectHeaderIcon>P</S.ProjectHeaderIcon>
            <S.ProjectName>Project: Z</S.ProjectName>
          </S.ProjectListContent>
        </S.ProjectList>
      </S.ProjectContainer>
      <S.UpgradeContainer>
        <S.UpgradeTitleWrapper>
          <S.UpgradeTitle>요금제 정보</S.UpgradeTitle>
          <ArrowRightOff />
        </S.UpgradeTitleWrapper>
        <S.UpgradeContext>스탠다드 구독 중</S.UpgradeContext>
      </S.UpgradeContainer>
    </S.Container>
  );
};

export default Sidebar;
