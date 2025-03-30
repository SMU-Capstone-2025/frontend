import React from "react";
import { Modal } from "../index";
import { useTaskColumn } from "../../hooks/useTaskColumn";
import TaskCard from "./TaskCard";
import PlusOn from "../../assets/icons/Plus/PlusOn";

const dummyTasks = [
  {
    id: 1,
    title: "더미 데이터1입니다.",
    description: "이건 첫 번째 작업에 대한 설명입니다.",
    date: "2024-03-21",
  },
  {
    id: 2,
    title: "더미 데이터2입니다.",
    description: "두 번째 작업은 마감일이 임박했어요!",
    date: "2024-03-22",
  },
  {
    id: 3,
    title: "더미 데이터3입니다.",
    description: "세 번째 작업은 회의 준비와 관련 있습니다.",
    date: "2024-03-23",
  },
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
    <div className="flex w-[410px] p-4 justify-center items-center gap-[12px] rounded-[12px] border border-[var(--gray-200,#E5E7EB)] bg-[var(--yellow-50,#FEFCE8)]">
      <div className="flex w-[380px] flex-col items-start gap-4 shrink-0">
        <div className="flex h-[30px] justify-between items-center self-stretch">
          <div className="flex w-[90px] items-center gap-2.5">
            <div className="flex h-[31.72px] px-3 py-2 justify-center items-center gap-2.5 rounded-md bg-[var(--yellow-200,#fef08a)] text-[var(--yellow-900,#713F12)] text-sm font-semibold leading-[140%] tracking-[-0.14px]">
              진행 전
            </div>
            <div className="text-[var(--yellow-900,#713F12)] text-sm font-semibold leading-[140%] tracking-[-0.14px] font-pretendard">
              {tasks.length}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:bg-white"
          >
            <PlusOn />
          </button>
        </div>

        <div className="flex w-[380px] flex-col items-start gap-2">
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
            className="flex w-[380px] p-3 flex-col items-start gap-[10px] rounded-[10px] shadow-[0px_1.866px_9.05px_rgba(0,0,0,0.06)] self-stretch text-[var(--gray-500,#6D7280)] text-base font-semibold leading-[140%] tracking-[-0.32px] font-pretendard cursor-pointer hover:bg-white"
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
        <h2 className="text-lg font-bold mb-2">진행 전 작업 추가</h2>
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

export default TodoColumn;
