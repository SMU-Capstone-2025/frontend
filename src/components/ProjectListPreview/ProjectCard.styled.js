import styled from "styled-components";

const Container = styled.div`
  width: 302px;
  height: 219px;
  border-radius: 12px;
  border: 1px solid var(--gray-200, #e5e7eb);
  background: var(--0, #fff);
  position: relative;
  z-index: 1;
`;

const CardCover = styled.div`
  width: 302px;
  height: 59px;
  flex-shrink: 0;
  border-radius: 12px 12px 0px 0px;
  background: var(--blue-400, #5ba7f7);
  z-index: 2;
`;

const CardContentWrapper = styled.div`
  display: flex;
  width: 262px;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  position: absolute;
  left: 20px;
  top: 30px;
  z-index: 10;
`;

const CardHeaderIcon = styled.div`
  display: flex;
  width: 56px;
  height: 56px;
  justify-content: center;
  align-items: center;
  border-radius: 500px;
  border: 1px solid var(--0, #fff);
  background: var(--blue-100, #d5e8fc);
  color: var(--blue-500, #3191f2);
  text-align: center;
  font-family: Pretendard;
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 36.4px */
  letter-spacing: -0.56px;
`;

const CardTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  align-self: stretch;
`;
const CardTitle = styled.p`
  color: var(--gray-800, #1f2937);

  /* lg Semi Bold */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 25.2px */
  letter-spacing: -0.36px;
`;
const CardDescription = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  align-self: stretch;
  overflow: hidden;
  color: var(--gray-500, #6d7280);
  text-overflow: ellipsis;
  /* xs Regular */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
`;

const ContributorsIconsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 24px;
  align-items: center;
  position: relative; /* Enable positioning for child elements */
`;

const ContributorsIcons = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  padding: 4px;
  align-items: center;
  border-radius: 500px;
  border: 1px solid var(--0, #fff);
  background: ${(props) => props.color || "var(--blue-100, #d5e8fc)"};
  position: relative; /* Position icons absolutely within the wrapper */
  right: ${(props) => props.left || "0px"}; /* Dynamically set the position */
`;
const Text = styled.p`
  width: 100%;
  height: 100%;
  color: var(--0, #fff);
  text-align: center;

  /* xs Bold */
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 14px */
`;
export {
  Container,
  CardCover,
  CardContentWrapper,
  CardHeaderIcon,
  CardTitle,
  CardDescription,
  CardTextWrapper,
  ContributorsIconsWrapper,
  ContributorsIcons,
  Text,
};
