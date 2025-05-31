import React, { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { Modal } from "../index";
import PlusOn from "../../assets/icons/Plus/PlusOn";
import TaskForm from "./TaskForm";
import PlusHover from "../../assets/icons/Plus/PlusHover";

const initialTask = {
  projectId: "67f917f2faed8a4ff3f02bc3",
  title: "",
  modifiedBy: "",
  version: "",
  content: "",
  editors: [],
  deadline: "",
  status: "COMPLETED",
};

const CompletedColumn = ({
  taskList,
  autoSaveTask,
  loadTaskDetails,
  handleDelete,
  error,
  token,
  changeStatus,
}) => {
  const [newTask, setNewTask] = useState(initialTask);
  const [originalTask, setOriginalTask] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => task.status === "COMPLETED");
  }, [taskList]);

  // 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewTask(initialTask);
  };

  const handleCardClick = async (taskId) => {
    const latestVersion = await loadTaskDetails(taskId);
    // latestVersion => 해당 taskId의 카드 상세 정보
    const taskInfo = taskList.find((task) => task.taskId === taskId);

    if (!taskInfo) {
      console.log("해당 taskId의 정보 없음");
      return;
    }

    const mergedTask = {
      taskId: taskInfo.taskId,
      projectId: taskInfo.projectId,
      title: taskInfo.title,
      deadline: taskInfo.deadline,
      editors: latestVersion.editors || taskInfo.editors || [],
      modifiedBy: latestVersion.modifiedBy || taskInfo.modifiedBy || "",
      version: latestVersion.version || "1.0.0",
      content: latestVersion.content || "",
      status: taskInfo.status || "COMPLETED",
      attachmentList: latestVersion.attachmentList || [],
    };
    setOriginalTask(mergedTask);
    setNewTask(mergedTask);
    setIsModalOpen(true);
  };

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
    <div className="flex flex-col w-full max-w-[410px] sm:flex-1 sm:min-w-[280px] p-4 justify-center items-center gap-3 rounded-[12px] border border-[var(--gray-200,#E5E7EB)] bg-[var(--blue-50,#EDF6FC)]">
      <div className="flex h-[30px] justify-between items-center w-full">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[31.72px] px-3 py-2 justify-center items-center gap-2.5 rounded-md bg-[var(--blue-100,#D5E8FC)] text-[var(--blue-800,#064488)] text-sm font-semibold">
            완료
          </div>
          <div className="text-[var(--blue-800,#064488)] text-sm font-semibold">
            {filteredTasks.length}
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center justify-center w-6 h-6 cursor-pointer rounded-[10px]"
        >
          {isHovered ? <PlusHover /> : <PlusOn color="#064488" />}
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
          className="flex w-full p-3 flex-col items-start gap-[10px] rounded-[10px] shadow-[0px_1.866px_9.05px_rgba(0,0,0,0.06)] self-stretch text-[var(--gray-500,#6D7280)] text-base font-semibold hover:bg-white"
        >
          + 작업 만들기
        </button>
      </div>

      {/* 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={async () => {
          const isChanged = hasTaskChanged(originalTask, newTask);
          if (!isDeleting && (!originalTask || isChanged)) {
            await autoSaveTask(newTask);
          } else {
            console.log("🛑 저장하지 않음");
          }

          setIsModalOpen(false);
          setNewTask(initialTask);
          setOriginalTask(null);
          setIsDeleting(false);
        }}
        onDelete={async () => {
          setIsDeleting(true);
          await handleDelete(newTask.taskId);
          setIsModalOpen(false);
          setNewTask(initialTask);
          setOriginalTask(null);
        }}
        showDelete={!!newTask.taskId}
      >
        <TaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          newFiles={newFiles}
          setNewFiles={setNewFiles}
          token={token}
          onStatusUpdate={changeStatus}
        />
      </Modal>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CompletedColumn;
