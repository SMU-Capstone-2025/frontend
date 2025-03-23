import React from "react";
import {
  TaskCardContainer,
  TaskTitle,
  TaskDate,
  TaskCardItem,
} from "./TaskCard.styled";

function TaskCard({ title, date }) {
  return (
    <TaskCardContainer>
      <TaskCardItem>
        <TaskTitle>{title}</TaskTitle>
        <TaskDate>{date}</TaskDate>
      </TaskCardItem>
    </TaskCardContainer>
  );
}

export default TaskCard;
