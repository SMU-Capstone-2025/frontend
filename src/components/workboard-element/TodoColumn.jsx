import React from "react";
import { Modal } from "../index";
import { useTaskColumn } from "../../hooks/useTaskColumn";
import {
  AddButton,
  AddSecondButton,
  ColumnContainer,
  ColumnHeader,
  TaskContainer,
  TaskInput,
  TaskList,
  TaskStatus,
} from "./Columns.styled";
import TaskCard from "./TaskCard";

const dummyTasks = [
  { id: 1, title: "더미 데이터1입니다.", date: "2024-03-21" },
  { id: 2, title: "더미 데이터2입니다.", date: "2024-03-22" },
  { id: 3, title: "더미 데이터3입니다.", date: "2024-03-23" },
];

const TodoColumn = () => {
  const {
    tasks,
    newTask,
    setNewTask,
    isModalOpen,
    setIsModalOpen,
    handleAddTask,
  } = useTaskColumn(dummyTasks);

  return (
    <TaskContainer $bgColor="#DBEBFB">
      <ColumnContainer>
        <ColumnHeader>
          <TaskStatus>진행 전</TaskStatus>
          {tasks.length}
          <AddSecondButton onClick={() => setIsModalOpen(true)}>
            +
          </AddSecondButton>
        </ColumnHeader>

        <TaskList>
          {tasks.map(({ id, title, date }) => (
            <TaskCard key={id} title={title} date={date} />
          ))}
          <AddButton onClick={() => setIsModalOpen(true)}>
            + 작업 만들기
          </AddButton>
        </TaskList>
      </ColumnContainer>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      >
        <h2>진행 전 작업 추가</h2>
        <TaskInput
          type="text"
          placeholder="작업 제목 입력"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
      </Modal>
    </TaskContainer>
  );
};

export default TodoColumn;
