import React from "react";
import { useTaskColumn } from "../../hooks/useTaskColumn";
import { Modal } from "../index";
import TaskCard from "./TaskCard";
import PlusOn from "../../assets/icons/Plus/PlusOn";

const dummyTasks = [
  {
    id: 1,
    title: "더미 데이터1입니다.",
    description:
      "진행 중 예시 작업 설명중입니다. 오늘은 할메가커피를 마시고 있는데 아주 달콤하다. ",
    date: "2024-03-21",
  },
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
    <div className="flex flex-col w-full max-w-[410px] sm:flex-1 sm:min-w-[280px] p-4 justify-center items-center gap-3 rounded-[12px] border border-[var(--gray-200,#E5E7EB)] bg-[var(--red-50,#FEF2F2)]">
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex h-[30px] justify-between items-center w-full">
          <div className="flex items-center gap-2.5">
            <div className="flex h-[31.72px] px-3 py-2 justify-center items-center gap-2.5 rounded-md bg-[var(--red-200,#FECACA)] text-[var(--red-800,#991B1B)] text-sm font-semibold leading-[140%] tracking-[-0.14px]">
              진행 중
            </div>
            <div className="text-[var(--red-800,#991B1B)] text-sm font-semibold leading-[140%] tracking-[-0.14px]">
              {tasks.length}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-white"
          >
            <PlusOn />
          </button>
        </div>

        <div className="flex flex-col items-start gap-2 w-full">
          {tasks.map(({ id, title, description, date }) => (
            <TaskCard
              key={id}
              title={title}
              description={description}
              date={date}
            />
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full p-3 flex-col items-start gap-[10px] rounded-[10px] shadow-[0px_1.866px_9.05px_rgba(0,0,0,0.06)] self-stretch text-[var(--gray-500,#6D7280)] text-base font-semibold leading-[140%] tracking-[-0.32px] font-pretendard hover:bg-white"
          >
            + 작업 만들기
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      >
        <h2 className="text-lg font-bold mb-2">진행 중 작업 추가</h2>
        <input
          type="text"
          placeholder="작업 제목 입력"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          className="w-full h-[14px] p-[15px_10px] border border-gray-300 rounded text-sm outline-none focus:border-green-500"
        />
      </Modal>
    </div>
  );
};

export default InProgressColumn;
