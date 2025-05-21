import React, { useState } from "react";
import * as S from "./Sidebar.styled";
import PlusOff from "../../assets/icons/Plus/PlusOff";
import ArrowRightOff from "../../assets/icons/ArrowRight/ArrowRightOff";

const Sidebar = () => {
  const [newProjectCreateModalOpen, setNewProjectCreateModalOpen] =
    useState(false);
  const handleNewProjectCreateModalOpen = () => {
    setNewProjectCreateModalOpen(!newProjectCreateModalOpen);
    console.log("프로젝트생성모달", newProjectCreateModalOpen);
  };
  return (
    <S.Container>
      <S.ProjectContainer>
        <S.ProjectHeader>
          <S.HeaderText>Project</S.HeaderText>
          <div
            className="hover:cursor-pointer"
            onClick={handleNewProjectCreateModalOpen}
          >
            <PlusOff />
            {/* //onClick={handleNewProjectCreateModalOpen}을 PlusOff에 하면 작동하지않음 */}
          </div>
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
