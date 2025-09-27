import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 25px 0 26px;
  width: 277px;
  height: 952px;
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
  background: #fff;
  box-sizing: border-box;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 202px;
  height: fit-content;
  margin-top: 22px;
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
  flex-direction: column;
  margin-top: 22px;
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

const ToggleBox = styled.div`
  display: flex;
  width: 208px;
  align-items: center;
  gap: 11px;
  margin-bottom: 24px;
`;

const ToggleButton = styled.div`
  width: 60px;
  height: 36px;
  flex-shrink: 0;
`;
const ToggleText = styled.div`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
`;

const UpgradeBox = styled.div`
  display: flex;
  width: 226px;
  height: 54px;
  padding: 10px 16px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f2f2f2;
`;
const UpgradeText = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 10.916px;
  font-style: normal;
  font-weight: ${(props) => props.bold || 400};
  line-height: normal;
`;
const UpsideBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const DownsideBox = styled.div`
  display: flex;
  flex-direction: column;
`;
export {
  Container,
  HeaderWrapper,
  HeaderText,
  ContentBlock,
  ProjectList,
  ProjectWrapper,
  ProjectName,
  ToggleBox,
  ToggleButton,
  ToggleText,
  UpgradeBox,
  UpgradeText,
  UpsideBox,
  DownsideBox,
};
