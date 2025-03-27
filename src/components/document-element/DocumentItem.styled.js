import styled from "styled-components";

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 12px;
  border-bottom: 1px solid #aaa;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

const PreviewText = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
`;

const DateText = styled.div`
  font-size: 12px;
  color: #999;
`;

const StatusBadge = styled.div`
  display: flex;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  background-color: ${(props) =>
    props.$status === "진행 전"
      ? "#5bc0de"
      : props.$status === "진행 중"
        ? "#ebbd7e"
        : props.$status === "완료"
          ? "#88c588"
          : "#aaa"};
`;

const RightContainer = styled.div`
  display: flex;
  width: 423px;
  justify-content: flex-end;
  align-items: center;
  gap: 44px;
`;

export {
  ItemContainer,
  InfoContainer,
  Title,
  PreviewText,
  DateText,
  StatusBadge,
  RightContainer,
};
