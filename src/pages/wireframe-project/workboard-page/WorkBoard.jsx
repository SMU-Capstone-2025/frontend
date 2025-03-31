import React from "react";
import TodoColumn from "../../../components/workboard-element/TodoColumn";
import InProgressColumn from "../../../components/workboard-element/InProgressColumn";
import CompletedColumn from "../../../components/workboard-element/CompletedColumn";

// 작은 화면일 때 컬럼이 가로로 들어가지 않고 아래로 떨어지게 구성
const WorkBoard = () => {
  return (
    <div className="flex flex-row flex-wrap lg:flex-nowrap justify-center items-start gap-6 px-4 lg:px-0 w-full">
      <TodoColumn />
      <InProgressColumn />
      <CompletedColumn />
    </div>
  );
};

export default WorkBoard;
