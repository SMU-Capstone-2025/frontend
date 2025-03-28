import React from "react";
import * as S from "./Sidebar.styled";

const Sidebar = ({ setSidebarOpen }) => {
  return (
    <S.Container>
      <S.UpsideBox>
        <S.HeaderWrapper>
          <S.HeaderText>project</S.HeaderText>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 4L12 20M4 12L20 12"
              stroke="#A2A2A2"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.HeaderWrapper>
        <S.ContentBlock>
          <S.ProjectList>
            <S.ProjectWrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <circle cx="15" cy="15" r="15" fill="#EDEDED" />
              </svg>
              <S.ProjectName>프로젝트 우하핳</S.ProjectName>
            </S.ProjectWrapper>
            <S.ProjectWrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <circle cx="15" cy="15" r="15" fill="#EDEDED" />
              </svg>
              <S.ProjectName>프로젝트 우하핳</S.ProjectName>
            </S.ProjectWrapper>
            <S.ProjectWrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <circle cx="15" cy="15" r="15" fill="#EDEDED" />
              </svg>
              <S.ProjectName>프로젝트 우하핳</S.ProjectName>
            </S.ProjectWrapper>
          </S.ProjectList>
        </S.ContentBlock>
      </S.UpsideBox>
      <S.DownsideBox>
        <S.ToggleBox>
          <S.ToggleButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="36"
              viewBox="0 0 60 36"
              fill="none"
            >
              <rect
                x="1"
                y="1"
                width="58"
                height="34"
                rx="17"
                fill="#DDDDDD"
                stroke="#555555"
                strokeWidth="2"
              />
              <circle cx="42" cy="18" r="14" fill="#555555" />
            </svg>
          </S.ToggleButton>
          <S.ToggleText>다크모드</S.ToggleText>
        </S.ToggleBox>
        <S.UpgradeBox>
          <S.UpgradeText bold={600}>요금제 정보</S.UpgradeText>
          <S.UpgradeText bold={400}>이런저런 우ㅏ와악 요금제</S.UpgradeText>
        </S.UpgradeBox>
      </S.DownsideBox>
    </S.Container>
  );
};

export default Sidebar;
