import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  align-self: stretch;
  background-color: #fff;
  box-sizing: border-box;
  gap: 27px;
`;

const LeftsideDateView = styled.div`
  display: flex;
  width: fit-content; //당일이 되면 95px, 그 전 날짜는 110px
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;
const RightsideWorkView = styled.div`
  display: flex;
  width: 450px;
  height: 113px;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 8px;
  border: 1px solid #e3e3e3;
`;

const DateText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`;
const DDayText = styled.div`
  color: ${(props) => props.isDday || "#B5B5B5"};
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ProjectTitleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
`;
export {
  Container,
  LeftsideDateView,
  RightsideWorkView,
  ProjectTitleContainer,
  DateText,
  DDayText,
};
