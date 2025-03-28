import React from "react";
import { useTaskColumn } from "../../hooks/useTaskColumn";
import { Modal } from "../index";
import {
  ColumnContainer,
  ColumnHeader,
  TaskList,
  AddButton,
  AddSecondButton,
  TaskInput,
  TaskStatus,
  TaskContainer,
} from "./Columns.styled";
import TaskCard from "./TaskCard";

const dummyTasks = [
  { id: 1, title: "더미 데이터1입니다.", date: "2024-03-21" },
];

const InProgressColumn = () => {
  const {
    tasks,
    newTask,
    setNewTask,
    isModalOpen,
    setIsModalOpen,
    handleAddTask,
  } = useTaskColumn(dummyTasks);

  return (
    <TaskContainer $bgColor="#FBEADB">
      <ColumnContainer>
        <ColumnHeader>
          <TaskStatus>진행 중</TaskStatus>
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
        <h2>진행 중 작업 추가</h2>
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

export default InProgressColumn;
