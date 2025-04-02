import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 1016px;
  padding: 20px;
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
  gap: 22px 12px;
  flex-shrink: 0;
  flex-wrap: wrap;
  background: #fff;
  z-index: 50;
`;

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 200px;
  height: 222px;
  gap: 22px;
`;
const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;
const HeaderText = styled.p`
  width: 164px;
  height: fit-content;
  color: var(--gray-400, #9ca3af);
  /* base Semi Bold */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 22.4px */
  letter-spacing: -0.32px;
`;

const ProjectList = styled.div`
  display: flex;
  width: 200px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
`;
const ProjectListContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;
const ProjectName = styled.div`
  width: 164px;
  color: var(--gray-800, #1f2937);

  /* sm Semi Bold */
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
  letter-spacing: -0.14px;
`;
const ProjectHeaderIcon = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  border-radius: 500px;
  border: 1px solid var(--0, #fff);
  background: var(--blue-100, #d5e8fc);
  color: var(--blue-500, #3191f2);
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 36.4px */
  letter-spacing: -0.56px;
`;

const UpgradeContainer = styled.div`
  display: inline-flex;
  padding: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: 8px;
  background: var(--gray-100, #f3f4f6);
`;
const UpgradeTitleWrapper = styled.div`
  display: flex;
  width: 176px;
  align-items: center;
  gap: 2px;
`;
const UpgradeTitle = styled.p`
  color: var(--gray-400, #9ca3af);

  /* xxs Bold */
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 14px */
`;
const UpgradeContext = styled.div`
  align-self: stretch;
  color: var(--gray-800, #1f2937);

  /* xs Bold */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 16.8px */
`;
export {
  Container,
  ProjectContainer,
  ProjectHeader,
  HeaderText,
  ProjectList,
  ProjectListContent,
  ProjectName,
  ProjectHeaderIcon,
  UpgradeContainer,
  UpgradeTitleWrapper,
  UpgradeTitle,
  UpgradeContext,
};
