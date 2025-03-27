import React from "react";
import * as S from "./DoctalkMain.styled";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/FeatureWireframeMain/Sidebar/Sidebar";

const DoctalkMain = () => {
  return (
    <S.Container>
      <Navbar />
      {/* <S.SidebarOverlay>
        <Sidebar />
        와이어프레임 사이드바라서 지워야함
      </S.SidebarOverlay> */}
      <S.MainContentContainer>
        <S.WelcomeCommentText>
          독톡님, 오늘도 힘차게 시작해볼까요!
        </S.WelcomeCommentText>
        <S.BodyContainer>
          <S.ScheduleContainer>
            <S.PreviewTitleText>예정된 이벤트</S.PreviewTitleText>
            <S.ScheduleBoard>{/* 스케줄리스트 컴포넌트 */}</S.ScheduleBoard>
          </S.ScheduleContainer>
          <S.ProjectContainer>
            <S.PreviewTitleText>나의 프로젝트</S.PreviewTitleText>
            <S.ProjectBoard>{/* 프로젝트카드 컴포넌트 */}</S.ProjectBoard>
          </S.ProjectContainer>
        </S.BodyContainer>
      </S.MainContentContainer>
    </S.Container>
  );
};

export default DoctalkMain;
