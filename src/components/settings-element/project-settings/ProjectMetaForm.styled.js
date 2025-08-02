import styled from "styled-components";

export const TextInfoWrapper = styled.div`
  display: flex;
  padding: 35px 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
`;

export const ProjectNameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  align-self: stretch;
`;

export const NameInputRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  align-self: stretch;
`;

export const FormLabel = styled.span`
  align-self: stretch;
  color: var(--gray-800, #1f2937);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
`;

export const ProjectIcon = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 500px;
  border: 1px solid var(--0, #fff);
  background: var(--blue-100, #d5e8fc);
  span {
    color: var(--blue-500, #3191f2);
    text-align: center;
    font-family: Pretendard;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: 130%; /* 36.4px */
    letter-spacing: -0.56px;
  }
`;

export const ProjectNameInput = styled.input`
  display: flex;
  height: 40px;
  padding: 11px 12px;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  border-radius: 4px;
  border: 1px solid var(--gray-200, #e5e7eb);
`;

export const ProjectDetailSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  align-self: stretch;
`;

export const ProjectDetailInput = styled.input`
  display: flex;
  height: 40px;
  padding: 9px 12px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 4px;
  border: 1px solid var(--gray-200, #e5e7eb);
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3191f2;
  color: white;
  font-weight: 500;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  line-height: 24px;

  &:hover {
    background-color: #0056b3;
  }
`;
