import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 588px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;
const DdayText = styled.p`
  color: var(--error, #e40505);

  /* sm Semi Bold */
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
  letter-spacing: -0.14px;
`;
const DateText = styled.p`
  color: var(--gray-500, #6d7280);

  /* sm Semi Bold */
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
  letter-spacing: -0.14px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  align-self: stretch;
`;

export { Container, DateWrapper, DdayText, DateText, CardList };
