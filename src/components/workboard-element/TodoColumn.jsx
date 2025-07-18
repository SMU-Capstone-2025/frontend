import React, { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { Modal } from "../index";
import PlusOn from "../../assets/icons/Plus/PlusOn";
import PlusHover from "../../assets/icons/Plus/PlusHover";
import TaskForm from "./TaskForm";

// TodoColumn의 입력 폼
const initialTask = {
  projectId: "687519535c29ce3bfec23162",
  title: "",
  modifiedBy: "",
  content: "",
  editors: [],
  deadline: "",
  status: "PENDING",
};

const TodoColumn = ({
  taskList,
  autoSaveTask,
  loadTaskDetails,
  handleDelete,
  error,
  token,
  changeStatus,
}) => {
  const [newTask, setNewTask] = useState(initialTask); // 현재 편집 중인 작업
  const [originalTask, setOriginalTask] = useState(null); // 원본 작업(변경 감지)
  const [newFiles, setNewFiles] = useState([]); // 첨부파일
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 여부
  const [isHovered, setIsHovered] = useState(false); // 아이콘 hover

  // 기존 작업 리스트에서 "PENDING" 상태만 가져옴
  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => task.status === "PENDING");
  }, [taskList]);

  // 모달 열기 + 작업 초기 상태
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewTask(initialTask);
  };

  // 작업 카드 클릭 -> 작업 상세 정보 로딩 + 모달 열기
  const handleCardClick = async (taskId) => {
    const taskInfo = await loadTaskDetails(taskId);
    if (!taskInfo) {
      console.log("해당 taskId의 정보 없음");
      return;
    }

    // 작업 정보 + 버전 정보 = mergedTask
    const mergedTask = {
      taskId: taskInfo.taskId,
      title: taskInfo.title,
      deadline: taskInfo.deadline,
      coworkers: taskInfo.editors || [],
      modifiedBy: taskInfo.modifiedBy || "",
      content: taskInfo.content || "",
      status: taskInfo.status || "PENDING",
      attachmentList: taskInfo.attachmentList || [],
    };
    setOriginalTask(mergedTask);
    setNewTask(mergedTask);
    setIsModalOpen(true);
  };

  // 슈정 여부 비교
  const hasTaskChanged = (original, current) => {
    if (!original) return false;
    return (
      original.title !== current.title ||
      original.status !== current.status ||
      original.content !== current.content ||
      original.deadline !== current.deadline ||
      original.attachmentList !== current.attachmentList
    );
  };

  return (
    <div className="flex flex-col w-full max-w-[410px] sm:flex-1 sm:min-w-[280px] p-4 justify-center items-center gap-3 rounded-[12px] border border-[var(--gray-200,#E5E7EB)] bg-[var(--yellow-50,#FEFCE8)]">
      <div className="flex h-[30px] justify-between items-center w-full">
        <div className="flex items-center gap-2.5 font-[Livvic]">
          <div className="flex h-[31.72px] px-3 py-2 justify-center items-center gap-2.5 rounded-md bg-[var(--yellow-200,#fef08a)] text-[var(--yellow-900,#713F12)] text-sm font-semibold">
            진행 전
          </div>
          <div className="text-[var(--yellow-900,#713F12)] text-sm font-semibold">
            {filteredTasks.length}
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center justify-center w-6 h-6 cursor-pointer rounded-[10px]"
        >
          {isHovered ? <PlusHover /> : <PlusOn color="#713F12" />}
        </button>
      </div>

      <div className="flex flex-col items-start w-full gap-2">
        {filteredTasks.map((task) => {
          const latestVersion = task.versionHistory?.at(-1);
          const attachments = latestVersion?.attachmentList || [];
          return (
            <TaskCard
              key={task.taskId}
              title={task.title || "제목 없음"}
              content={
                task.content ||
                task.versionHistory?.at(-1)?.content ||
                "내용 없음"
              }
              date={task.deadline || "기한 없음"}
              editors={task.editors || []}
              attachmentCount={attachments.length}
              onClick={() => handleCardClick(task.taskId)}
            />
          );
        })}

        <button
          onClick={handleOpenModal}
          className="font-[Liviic] flex w-full p-3 flex-col items-start gap-[10px] rounded-[10px] shadow-[0px_1.866px_9.05px_rgba(0,0,0,0.06)] self-stretch text-[var(--gray-500,#6D7280)] text-base font-semibold hover:bg-white"
        >
          + 작업 만들기
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={async () => {
          const isChanged = hasTaskChanged(originalTask, newTask);
          if (!isDeleting && (!originalTask || isChanged)) {
            await autoSaveTask(newTask);
          } else {
            console.log("🛑 저장X");
          }

          setIsModalOpen(false);
          setNewTask(initialTask);
          setOriginalTask(null);
          setIsDeleting(false);
        }}
        onDelete={async () => {
          setIsDeleting(true);
          await handleDelete(newTask.taskId); // 삭제 요청
          setIsModalOpen(false);
          setNewTask(initialTask);
          setOriginalTask(null);
        }}
        showDelete={!!newTask.taskId}
      >
        <TaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          token={token}
          onStatusUpdate={changeStatus}
        />
      </Modal>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TodoColumn;
