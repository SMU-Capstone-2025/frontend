// WorkBoard.jsx
import React, { useEffect, useState } from "react";
import TodoColumn from "../../../components/workboard-element/TodoColumn";
import InProgressColumn from "../../../components/workboard-element/InProgressColumn";
import CompletedColumn from "../../../components/workboard-element/CompletedColumn";
import useTaskColumn from "../../../hooks/useTaskColumn";
import { useOutletContext } from "react-router-dom";
import { fetchProject } from "../../../api/projectApi";
import { DragDropContext } from "@hello-pangea/dnd";

const WorkBoard = () => {
  const { projectId } = useOutletContext();
  const {
    todoList,
    inProgressList,
    completedList,
    createNewTask,
    handleDelete,
    loadTaskDetails,
    autoSaveTask,
    error,
    token,
    changeStatus,
  } = useTaskColumn(projectId);

  const [coworkers, setCoworkers] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const { result } = await fetchProject(projectId);
        setCoworkers(result?.coworkers || []);
      } catch (e) {
        console.error("coworkers 불러오기 실패:", e);
        setCoworkers([]);
      }
    })();
  }, [projectId]);

  // 드래그앤드롭 종료 시 실행
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // 같은 위치로 드롭시 무시
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId; // droppableId를 status 값으로 활용
    try {
      await changeStatus(draggableId, newStatus); // 드래그앤드롭 후 UI 적용
    } catch (err) {
      console.error("드래그 상태 변경 실패:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-wrap justify-start items-start gap-6 w-full">
        <TodoColumn
          taskList={todoList}
          createNewTask={createNewTask}
          handleDelete={handleDelete}
          loadTaskDetails={loadTaskDetails}
          autoSaveTask={autoSaveTask}
          error={error}
          token={token}
          projectId={projectId}
          coworkers={coworkers}
        />
        <InProgressColumn
          taskList={inProgressList}
          createNewTask={createNewTask}
          handleDelete={handleDelete}
          loadTaskDetails={loadTaskDetails}
          autoSaveTask={autoSaveTask}
          error={error}
          token={token}
          projectId={projectId}
          coworkers={coworkers}
        />
        <CompletedColumn
          taskList={completedList}
          createNewTask={createNewTask}
          handleDelete={handleDelete}
          loadTaskDetails={loadTaskDetails}
          autoSaveTask={autoSaveTask}
          error={error}
          token={token}
          projectId={projectId}
          coworkers={coworkers}
        />
      </div>
    </DragDropContext>
  );
};

export default WorkBoard;
