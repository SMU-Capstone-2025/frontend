import styled from "styled-components";

const ProjectPreviewCard = styled.div`
  display: flex;
  width: 364px;
  height: 256px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 20px;
  background: #fff;
  position: relative;
  z-index: 1;
  /* 1 */
  box-shadow: 0px 2px 9.4px 0px rgba(0, 0, 0, 0.08);
`;

const CardCover = styled.div`
  height: 81px;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 20px 20px 0px 0px;
  background: #f1f1f1;
  z-index: 1;
`;

const CardContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
  align-self: stretch;
  position: relative;
  z-index: 10;
  top: -51px;
  left: 24px;
`;
const CardHeaderIcon = styled.div`
  width: 58px;
  height: 58px;
  fill: #d0d0d0;
`;
/* <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
  <circle cx="29" cy="29" r="29" fill="#D0D0D0"/>
</svg> */

const CardTitle = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
const CardDescription = styled.div`
  width: 316px;
  height: 44px;
  align-self: stretch;
  overflow: hidden;
  color: #787878;
  text-overflow: ellipsis;
  white-space: wrap;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ContributorWrapper = styled.div`
  width: 45px;
  height: 24px;
`;
const ContributorImage = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 0.5px solid #000;
  background: var(--Bloo-Light-30, #ddd);
  position: relative;
`;

export {
  ProjectPreviewCard,
  CardCover,
  CardContentWrapper,
  CardHeaderIcon,
  CardTitle,
  CardDescription,
  ContributorWrapper,
  ContributorImage,
};
