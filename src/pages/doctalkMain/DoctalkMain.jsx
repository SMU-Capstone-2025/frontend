import React from "react";
import * as S from "./DoctalkMain.styled";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/FeatureWireframeMain/Sidebar/Sidebar";
import ScheduleListPreview from "../../components/ScheduleListPreview/ScheduleListPreview";
import ProjectListPreview from "../../components/ProjectListPreview/ProjectListPreview";

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
            <S.ScheduleBoard>
              <ScheduleListPreview />
              <ScheduleListPreview />
            </S.ScheduleBoard>
          </S.ScheduleContainer>
          <S.ProjectContainer>
            <S.PreviewTitleText>나의 프로젝트</S.PreviewTitleText>
            <S.ProjectBoard>
              <ProjectListPreview />
            </S.ProjectBoard>
          </S.ProjectContainer>
        </S.BodyContainer>
      </S.MainContentContainer>
    </S.Container>
  );
};

export default DoctalkMain;
