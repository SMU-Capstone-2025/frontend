import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 1920px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background: var(--gray-50, #f9fafb);
`;

const MainContentContainer = styled.div`
  display: flex;
  width: 1280px;
  padding: 50px 0px;
  flex-direction: column;
  align-items: center;
  gap: 50px;
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
export { Container, MainContentContainer, WelcomeComment, WelcomeCommentText };
