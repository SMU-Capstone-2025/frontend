import React from "react";
import TodoColumn from "../../../components/workboard-element/TodoColumn";
import InProgressColumn from "../../../components/workboard-element/InProgressColumn";
import CompletedColumn from "../../../components/workboard-element/CompletedColumn";

const WorkBoard = () => {
  return (
    <div className="flex items-start gap-6">
      <TodoColumn />
      <InProgressColumn />
      <CompletedColumn />
    </div>
  );
};

export default WorkBoard;
