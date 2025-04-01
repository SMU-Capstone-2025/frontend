import styled from "styled-components";

export const MemberAddWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const MemberAddInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 403px;
  height: 40px;
`;
export const MemberAddInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

export const MemberAddButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export const AddLinkButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid var(--gray-200, #e5e7eb);
  background: var(--0, #fff);
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
`;

export const AddMemberButton = styled.button`
  display: inline-flex;
  padding: 8px 16px 8px 8px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 4px;
  color: #fff;
  border: none;
  background: var(--blue-500, #3191f2);
  cursor: pointer;

  span {
    color: var(--0, #fff);
    text-align: center;

    /* sm Semi Bold */
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 19.6px */
    letter-spacing: -0.14px;
  }
`;
