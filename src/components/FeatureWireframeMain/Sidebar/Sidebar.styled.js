import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 277px;
  height: 952px;
  flex-shrink: 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderText = styled.p`
  width: 202px;
  color: #787878;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ContentBlock = styled.div`
  display: flex;
`;

const ProjectList = styled.div`
  display: flex;
  width: 226px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
`;

const ProjectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  align-self: stretch;
`;
const ProjectName = styled.div`
  width: 164px;
  color: #383838;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export {
  Container,
  HeaderWrapper,
  HeaderText,
  ContentBlock,
  ProjectList,
  ProjectWrapper,
  ProjectName,
};
