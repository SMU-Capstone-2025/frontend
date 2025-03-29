import styled from "styled-components";

export const MembersSection = styled.div`
  display: flex;
  width: 628px;
  padding: 30px 29px;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  border-radius: 12px;
  border: 1px solid var(--gray-200, #e5e7eb);
  background: #fff;
`;

export const Label = styled.span`
  align-self: stretch;
  color: var(--gray-800, #1f2937);

  /* xs Bold */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 16.8px */
`;
