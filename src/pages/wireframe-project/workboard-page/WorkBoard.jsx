// WorkBoard.jsx
import React from "react";
import TodoColumn from "../../../components/workboard-element/TodoColumn";
import InProgressColumn from "../../../components/workboard-element/InProgressColumn";
import CompletedColumn from "../../../components/workboard-element/CompletedColumn";
import useTaskColumn from "../../../hooks/useTaskColumn";

// 작은 화면일 때 컬럼이 가로로 들어가지 않고 아래로 떨어지게 구성
const WorkBoard = () => {
  const {
    todoList,
    inProgressList,
    completedList,
    createNewTask,
    handleDelete,
    loadTaskDetails,
    autoSaveTask,
    error,
  } = useTaskColumn();
  return (
    <div className="flex flex-wrap justify-start items-start gap-6 w-full">
      <TodoColumn
        taskList={todoList}
        createNewTask={createNewTask}
        handleDelete={handleDelete}
        loadTaskDetails={loadTaskDetails}
        autoSaveTask={autoSaveTask}
        error={error}
      />
      <InProgressColumn
        taskList={inProgressList}
        createNewTask={createNewTask}
        handleDelete={handleDelete}
        loadTaskDetails={loadTaskDetails}
        autoSaveTask={autoSaveTask}
        error={error}
      />
      <CompletedColumn
        taskList={completedList}
        createNewTask={createNewTask}
        handleDelete={handleDelete}
        loadTaskDetails={loadTaskDetails}
        autoSaveTask={autoSaveTask}
        error={error}
      />
    </div>
  );
};

export default WorkBoard;
