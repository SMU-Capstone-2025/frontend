import { useState, useEffect } from "react";
import {
  createTask,
  createVersion,
  fetchTaskList,
  deleteTask,
  getTaskDetails,
  fetchVersionList,
  changeTaskStatus,
  uploadFile,
} from "../api/taskApi";

const useTaskColumn = (projectId) => {
  const [todoList, setTodoList] = useState([]);
  const [inProgressList, setInProgressList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // 중복 저장 방지
  const token = localStorage.getItem("accessToken");
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (!projectId) return;
    loadTaskList(projectId);
  }, [projectId]);

  // ✅전체 작업 목록 불러오기 (coworkers → editors 매핑)
  const loadTaskList = async (pid) => {
    try {
      const { result } = await fetchTaskList(pid);

      // 중복 제거 + coworkers를 editors로 보정
      const uniqueTasks = Array.from(
        new Map(result.map((t) => [t.taskId || t.id, t])).values()
      ).map((task) => ({
        ...task,
        taskId: task.id || task.taskId,
        editors: task.editors?.length ? task.editors : task.coworkers || [],
        coworkers: task.coworkers || task.editors || [],
      }));
      // get요청과 put요청의 필드값 통일을 위해 editors로 보정해줌

      setTodoList(uniqueTasks.filter((t) => t.status === "PENDING"));
      setInProgressList(uniqueTasks.filter((t) => t.status === "PROGRESS"));
      setCompletedList(uniqueTasks.filter((t) => t.status === "COMPLETED"));

      return uniqueTasks;
    } catch (err) {
      console.error("작업 목록 불러오기 실패:", err);
    }
  };

  // ✅ 새 작업 생성
  const createNewTask = async (data, fileId = null) => {
    const status = ["PENDING", "PROGRESS", "COMPLETED"].includes(data.status)
      ? data.status
      : "PENDING";

    const taskPayload = {
      title: data.title,
      projectId,
      status,
      modifiedBy: userEmail,
      version: "1.0.0",
      content: data.content || "기본 내용",
      editors: data.editors || [],
      deadline: data.deadline || "2025-07-11",
    };

    try {
      const createdTask = await createTask(taskPayload);

      // 초기 버전 생성
      const versionData = {
        taskId: createdTask.id,
        title: createdTask.title,
        status,
        version: "1.0.0",
        modifiedBy: data.modifiedBy || userEmail,
        content: data.content || "내용 공백",
        editors: data.editors || [],
        coworkers: data.editors || [],
        deadline: data.deadline || null,
        projectId,
      };

      await createVersion(versionData, fileId);

      const versionHistory = await fetchVersionList(createdTask.id);
      const newTask = {
        ...createdTask,
        taskId: createdTask.id,
        status,
        editors: createdTask.editors,
        coworkers: createdTask.editors,
        versionHistory,
        currentVersion: versionHistory.at(-1)?.version,
      };

      if (status === "PENDING") setTodoList((prev) => [...prev, newTask]);
      else if (status === "PROGRESS")
        setInProgressList((prev) => [...prev, newTask]);
      else if (status === "COMPLETED")
        setCompletedList((prev) => [...prev, newTask]);

      return newTask;
    } catch (err) {
      setError("작업 생성 실패");
      console.error("❌ 작업 생성 실패:", err);
      throw err;
    }
  };

  // ✅ 공통 버전 저장 함수 (변경사항 없으면 스킵)
  const saveTask = async (data, options = {}) => {
    if (isSaving) return;
    setIsSaving(true);

    const { file, deleteFileId } = options;
    try {
      let uploadResult = null;

      if (file) {
        uploadResult = await uploadFile(file);
      }

      // 최신 버전 조회
      const history = await fetchVersionList(data.taskId);
      const latest = history.at(-1);

      // 변경사항 비교 (내용, 제목, 데드라인, 에디터, 파일 등)
      const hasChanges =
        !latest ||
        latest.title !== data.title ||
        latest.content !== data.content ||
        latest.deadline !== data.deadline ||
        JSON.stringify(latest.editors || []) !==
          JSON.stringify(data.editors || []) ||
        file ||
        deleteFileId; // 파일 변경이 있으면 무조건 저장

      if (!hasChanges) {
        return;
      }

      const nextVersion = getNextVersion(history);

      const task =
        todoList.find((t) => t.taskId === data.taskId) ||
        inProgressList.find((t) => t.taskId === data.taskId) ||
        completedList.find((t) => t.taskId === data.taskId);

      const versionData = {
        taskId: data.taskId,
        title: data.title,
        version: nextVersion,
        modifiedBy: data.modifiedBy || userEmail,
        content: data.content,
        editors:
          data.editors !== undefined ? data.editors : task?.editors || [],
        coworkers:
          data.coworkers !== undefined ? data.coworkers : task?.coworkers || [],
        deadline: data.deadline || null,
        projectId,
        status: data.status || "PENDING",
      };

      if (uploadResult) {
        const { fileId, fileName } = uploadResult;
        await createVersion(versionData, { fileId, fileName });
      } else if (deleteFileId) {
        await createVersion(versionData, { fileId: deleteFileId });
      } else {
        await createVersion(versionData);
      }
      await loadTaskList(projectId);
    } catch (err) {
      console.error("❌ saveTask 실패:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ 자동 저장
  const autoSaveTask = async (data) => {
    if (!data.title || !data.content || !data.deadline) return;
    if (!data.taskId) {
      await createNewTask(data);
      return;
    }
    await saveTask(data);
  };

  // ✅ 파일 추가
  const saveTaskWithFile = async (data, file) => {
    if (!file) return;
    if (!data.taskId) {
      const created = await createTask(data);
      return created;
    }
    await saveTask(data, { file });
  };

  // ✅ 파일 삭제
  const saveTaskAfterFileDelete = async (data, fileId) => {
    if (!fileId || !data.taskId) return;
    await saveTask(data, { deleteFileId: fileId });
  };

  // ✅ 작업 삭제
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      await loadTaskList(projectId);
    } catch (err) {
      console.error("❌ 작업 삭제 실패:", err.message);
    }
  };

  // ✅작업 개별 조회
  const loadTaskDetails = async (taskId) => {
    if (!token) return;
    try {
      const res = await getTaskDetails(taskId);
      return res.result;
    } catch (err) {
      console.error("작업 상세 조회 실패", err);
      throw err;
    }
  };

  // ✅자동 버전 증가 (9 이상이면 자리 올림)
  const getNextVersion = (history = []) => {
    const versions = history
      .map((v) => v.version)
      .map((ver) => ver.split(".").map(Number))
      .filter((v) => v.length === 3 && v.every((n) => !isNaN(n)));

    if (versions.length === 0) return "1.0.0";

    versions.sort((a, b) => {
      for (let i = 0; i < 3; i++) {
        if (a[i] !== b[i]) return b[i] - a[i];
      }
      return 0;
    });

    let [major, minor, patch] = versions[0];

    if (patch < 9) {
      patch += 1;
    } else {
      patch = 0;
      if (minor < 9) {
        minor += 1;
      } else {
        minor = 0;
        major += 1;
      }
    }

    return `${major}.${minor}.${patch}`;
  };

  // ✅ 작업 상태 변경
  const changeStatus = async (taskId, newStatus) => {
    let task =
      todoList.find((t) => t.taskId === taskId) ||
      inProgressList.find((t) => t.taskId === taskId) ||
      completedList.find((t) => t.taskId === taskId);

    if (!task) return;

    const updatedTask = { ...task, status: newStatus };

    // UI 먼저 반영
    setTodoList((prev) => prev.filter((t) => t.taskId !== taskId));
    setInProgressList((prev) => prev.filter((t) => t.taskId !== taskId));
    setCompletedList((prev) => prev.filter((t) => t.taskId !== taskId));

    if (newStatus === "PENDING") setTodoList((prev) => [...prev, updatedTask]);
    if (newStatus === "PROGRESS")
      setInProgressList((prev) => [...prev, updatedTask]);
    if (newStatus === "COMPLETED")
      setCompletedList((prev) => [...prev, updatedTask]);

    // 후 서버 반영
    try {
      await changeTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error("작업 상태 변경 실패", err);
      await loadTaskList(projectId); // 실패 시 다시 동기화
    }
  };

  return {
    todoList,
    inProgressList,
    completedList,
    createNewTask,
    autoSaveTask,
    handleDelete,
    loadTaskDetails,
    token,
    error,
    changeStatus,
    loadTaskList,
    saveTaskWithFile,
    saveTaskAfterFileDelete,
  };
};

export default useTaskColumn;
