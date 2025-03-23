import React from "react";
import { BoardContainer, BoardWrapper } from "./WorkBoard.styled";
import TodoColumn from "./TodoColumn";
import InProgressColumn from "./InProgressColumn";
import CompletedColumn from "./CompletedColumn";

const WorkBoard = () => {
  return (
    <BoardContainer>
      <BoardWrapper>
        <TodoColumn />
        <InProgressColumn />
        <CompletedColumn />
      </BoardWrapper>
    </BoardContainer>
  );
};

export default WorkBoard;
