import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 952px;
  background: #f6f6f6;
`;

const BodyContainer = styled.div`
  // 회색페이지 전체 감싸기
  display: flex;
  flex-direction: column;
  gap: 51px;
  padding: 62px 0 0 60px;
`;
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 38px;
`;
const UserMessage = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #1d1d1d;
  font-family: Inter;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
export { Container, MainContent, BodyContainer, PreviewContainer, UserMessage };
