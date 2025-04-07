import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "../index";
import TaskCard from "./TaskCard";
import PlusOn from "../../assets/icons/Plus/PlusOn";

const CompletedColumn = () => {
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ 변수명 통일
  const [error, setError] = useState(null);

  // 작업 추가
  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const taskData = {
      title: newTask,
      modifiedBy: "홍길동", // 실제 사용자 정보로 교체
      version: "1.0",
      summary: "간단한 요약입니다",
      content: "상세 설명입니다",
      editors: ["hong@example.com"],
    };

    try {
      const response = await axios.post(
        "http://172.1.68.222:8080/task/post",
        taskData,
        { headers: { "Content-Type": "application/json" } }
      );

      const newTaskData = response.data.result;
      const latestVersion = newTaskData.versionHistory[0];

      setFetchedTasks((prev) => [
        ...prev,
        {
          id: newTaskData.id,
          title: newTaskData.title,
          summary: latestVersion.summary,
          version: latestVersion.version,
          deadline: newTaskData.deadline,
          editors: newTaskData.editors,
        },
      ]);
      console.log(newTaskData);
      setNewTask("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("작업 추가 실패:", error);
      setError("작업을 추가하지 못했습니다.");
    }
  };

  // 작업 불러오기
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get("http://172.1.68.222:8080/task/get");
        setFetchedTasks(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("작업 불러오기 실패:", error);
        setError("작업을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-[410px] sm:flex-1 sm:min-w-[280px] p-4 justify-center items-center gap-3 rounded-[12px] border border-[var(--gray-200,#E5E7EB)] bg-[var(--blue-50,#EDF6FC)]">
      {/* 로딩 중 */}
      {isLoading && (
        <p className="text-gray-500 text-sm animate-pulse">불러오는 중...</p>
      )}

      {/* 에러 발생 */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* 정상 렌더링 */}
      {!isLoading && !error && (
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex h-[30px] justify-between items-center w-full">
            <div className="flex items-center gap-2.5">
              <div className="flex h-[31.72px] px-3 py-2 justify-center items-center gap-2.5 rounded-md bg-[var(--blue-100,#D5E8FC)] text-[var(--blue-800,#064488)] text-sm font-semibold leading-[140%] tracking-[-0.14px]">
                완료
              </div>
              <div className="text-[var(--blue-800,#064488)] text-sm font-semibold leading-[140%] tracking-[-0.14px]">
                {fetchedTasks.length}
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
            {fetchedTasks.map(({ id, title, summary, version, editors }) => (
              <TaskCard
                key={id}
                title={title}
                description={summary}
                date={version}
                editors={editors}
              />
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex w-full p-3 flex-col items-start gap-[10px] rounded-[10px] shadow-[0px_1.866px_9.05px_rgba(0,0,0,0.06)] self-stretch text-[var(--gray-500,#6D7280)] text-base font-semibold leading-[140%] tracking-[-0.32px] font-pretendard cursor-pointer hover:bg-white"
            >
              + 작업 만들기
            </button>
          </div>
        </div>
      )}

      {/* 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      >
        <h2 className="text-lg font-bold mb-2">완료 작업 추가</h2>
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

export default CompletedColumn;
