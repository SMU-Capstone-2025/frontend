import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 1920px;
  height: 1080px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: var(--gray-50, #f9fafb);
`;

const SidebarOverlay = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const OutSidebar = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 40;
  cursor: pointer;
`;

const MainContentContainer = styled.div`
  display: flex;
  width: 1280px;
  padding: 50px 0px;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  position: absolute;
  top: 64px;
  left: 320px;
  z-index: 20;
`;
const WelcomeComment = styled.div`
  display: flex;
  width: 676px;
  height: 100px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const WelcomeCommentText = styled.p`
  color: var(--gray-800, #1f2937);
  text-align: center;

  /* display */
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 42px */
  letter-spacing: -1.2px;
`;

const BodyContainer = styled.div`
  display: flex;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;
const ScheduleContainer = styled.div`
  display: flex;
  width: 628px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;
const ScheduleBoard = styled.div`
  display: flex;
  padding: 30px 20px 20px 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 60px;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid var(--gray-200, #e5e7eb);
  background: var(--0, #fff);
`;

const ProjectContainer = styled.div`
  display: flex;
  width: 628px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;
const ProjectBoard = styled.div`
  //grid로 바꾸기
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 24px;
  align-self: stretch;
  flex-wrap: wrap;
`;
const PreviewTitleText = styled.p`
  align-self: stretch;
  color: var(--gray-400, #9ca3af);
  /* sm Semi Bold */
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
  letter-spacing: -0.14px;
`;

export {
  Container,
  OutSidebar,
  MainContentContainer,
  WelcomeComment,
  WelcomeCommentText,
  SidebarOverlay,
  BodyContainer,
  ScheduleContainer,
  ProjectContainer,
  PreviewTitleText,
  ScheduleBoard,
  ProjectBoard,
};
