import React, { useEffect, useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { Modal } from "../index";
import PlusOn from "../../assets/icons/Plus/PlusOn";
import PlusHover from "../../assets/icons/Plus/PlusHover";
import TaskForm from "./TaskForm";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const initialTask = (projectId) => ({
  projectId,
  title: "",
  modifiedBy: "",
  content: "",
  coworkers: [],
  deadline: "",
  status: "PROGRESS",
});

const InProgressColumn = ({
  projectId,
  taskList,
  autoSaveTask,
  loadTaskDetails,
  handleDelete,
  error,
  token,
  changeStatus,
  coworkers,
}) => {
  const [newTask, setNewTask] = useState(initialTask(projectId));
  const [originalTask, setOriginalTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // coworkers 변경 시 자동 저장
  useEffect(() => {
    if (!newTask.taskId) return;
    autoSaveTask(newTask);
  }, [newTask.coworkers]);

  // 진행중 상태만 필터링
  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => task.status === "PROGRESS");
  }, [taskList]);

  // 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewTask(initialTask(projectId));
  };

  // 카드 클릭 → 상세 조회 + 모달 열기
  const handleCardClick = async (taskId) => {
    const taskInfo = await loadTaskDetails(taskId);
    if (!taskInfo) return;

    const mergedTask = {
      taskId: taskInfo.taskId,
      projectId: taskInfo.projectId,
      title: taskInfo.title,
      deadline: taskInfo.deadline,
      coworkers: taskInfo.coworkers || [],
      editors: taskInfo.coworkers || [],
      modifiedBy: taskInfo.modifiedBy || "",
      content: taskInfo.content || "",
      status: taskInfo.status || "PROGRESS",
      attachmentList: taskInfo.attachmentList || [],
    };

    setOriginalTask(mergedTask);
    setNewTask(mergedTask);
    setIsModalOpen(true);
  };

  // 변경 감지
  const hasTaskChanged = (original, current) => {
    if (!original) return false;
    return (
      original.title !== current.title ||
      original.status !== current.status ||
      original.content !== current.content ||
      original.deadline !== current.deadline ||
      (original.coworkers || []).join() !== (current.coworkers || []).join() ||
      JSON.stringify(original.attachmentList) !==
        JSON.stringify(current.attachmentList)
    );
  };

  return (
    <Droppable droppableId="PROGRESS">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col w-full max-w-[410px] sm:flex-1 sm:min-w-[280px] p-4 justify-center items-center gap-3 rounded-[12px] border border-[var(--gray-200,#E5E7EB)] bg-[var(--red-50,#FEF2F2)]"
        >
          {/* 헤더 */}
          <div className="flex h-[30px] justify-between items-center w-full">
            <div className="flex items-center gap-2.5 font-[Livvic]">
              <div className="flex h-[31.72px] px-3 py-2 justify-center items-center gap-2.5 rounded-md bg-[var(--red-200,#FECACA)] text-[var(--red-800,#991B1B)] text-sm font-semibold">
                진행 중
              </div>
              <div className="text-[var(--red-800,#991B1B)] text-sm font-semibold">
                {filteredTasks.length}
              </div>
            </div>
            <button
              onClick={handleOpenModal}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex items-center justify-center w-6 h-6 cursor-pointer rounded-[10px]"
            >
              {isHovered ? <PlusHover /> : <PlusOn color="#991B1B" />}
            </button>
          </div>

          {/* 리스트 */}
          <div className="flex flex-col items-start w-full gap-2">
            {filteredTasks.map((task, index) => {
              const latestVersion = task.versionHistory?.at(-1);
              const attachments = latestVersion?.attachmentList || [];

              return (
                <Draggable
                  key={task.taskId}
                  draggableId={task.taskId}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-full"
                    >
                      <TaskCard
                        title={task.title || "제목 없음"}
                        content={
                          task.content || latestVersion?.content || "내용 없음"
                        }
                        date={task.deadline || "기한 없음"}
                        coworkers={task.coworkers || []}
                        attachmentCount={attachments.length}
                        onClick={() => handleCardClick(task.taskId)}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>

          {/* + 버튼 */}
          <button
            onClick={handleOpenModal}
            className="font-[Livvic] flex w-full p-3 flex-col items-start gap-[10px] 
                      rounded-[10px] shadow-[0px_1.866px_9.05px_rgba(0,0,0,0.06)] 
                      self-stretch text-[var(--gray-500,#6D7280)] text-base font-semibold 
                      hover:bg-white"
          >
            + 작업 만들기
          </button>

          {/* 모달 */}
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
              setNewTask(initialTask(projectId));
              setOriginalTask(null);
              setIsDeleting(false);
            }}
            onDelete={async () => {
              setIsDeleting(true);
              await handleDelete(newTask.taskId);
              setIsModalOpen(false);
              setNewTask(initialTask(projectId));
              setOriginalTask(null);
            }}
            showDelete={!!newTask.taskId}
          >
            <TaskForm
              newTask={newTask}
              setNewTask={setNewTask}
              token={token}
              onStatusUpdate={changeStatus}
              projectId={projectId}
              coworkers={coworkers}
            />
          </Modal>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      )}
    </Droppable>
  );
};

export default InProgressColumn;
