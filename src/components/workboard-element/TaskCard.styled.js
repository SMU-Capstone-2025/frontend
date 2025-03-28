import styled from "styled-components";

export const TaskCardContainer = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid #ededed;
  background: #fff;
  box-shadow: 0px 2px 9.7px 0px rgba(0, 0, 0, 0.06);
`;

export const TaskCardItem = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

export const TaskTitle = styled.h4`
  align-self: stretch;
  color: #000;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const TaskDate = styled.p`
  display: -webkit-box;
  width: 211px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: #787878;
  text-overflow: ellipsis;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
