import styled from "styled-components";

export const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
`;

export const MemberWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

export const MemberSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Avatar = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  padding: 5.333px;
  align-items: center;
  gap: 13.333px;
  border-radius: 666.667px;
  border: 1.333px solid var(--0, #fff);
  background: var(--blue-100, #d5e8fc);
`;

export const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;
`;

export const MemberName = styled.p`
  color: var(--gray-800, #1f2937);

  /* xs Bold */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 14px */
`;

export const MemberEmail = styled.p`
  color: var(--gray-800, #1f2937);

  /* xs Regular */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 14px */
  opacity: 0.5;
`;

export const MemberEditBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;
export const SelectRole = styled.select`
  display: flex;
  align-items: center;
  gap: 2px;
  border: none;
  cursor: pointer;
`;

export const RemoveButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;
