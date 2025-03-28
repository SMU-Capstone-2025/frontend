import React from "react";
import { BoardContainer, BoardWrapper } from "./WorkBoard.styled";
import TodoColumn from "../../../components/workboard-element/TodoColumn";
import InProgressColumn from "../../../components/workboard-element/InProgressColumn";
import CompletedColumn from "../../../components/workboard-element/CompletedColumn";

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
