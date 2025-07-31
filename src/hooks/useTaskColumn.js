// useTaskColumn.js
import { useState, useEffect } from "react";
import {
  createTask,
  createVersion,
  fetchTaskList,
  deleteTask,
  getTaskDetails,
  fetchVersionList,
  changeTaskStatus,
  //fetchLogList,
  uploadFile,
} from "../api/taskApi";

const useTaskColumn = (projectId) => {
  const [todoList, setTodoList] = useState([]);
  const [inProgressList, setInProgressList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!projectId) return;
    loadTaskList();
  }, [projectId]);

  // ✅전체 작업 목록 불러오기 및 컬럼별 분류
  const loadTaskList = async () => {
    try {
      const { result } = await fetchTaskList(projectId);

      setTodoList(result.filter((t) => t.status === "PENDING"));
      setInProgressList(result.filter((t) => t.status === "PROGRESS"));
      setCompletedList(result.filter((t) => t.status === "COMPLETED"));
    } catch (err) {
      console.error("작업 목록 불러오기 실패:", err);
    }
  };

  // ✅새 작업 추가
  const createNewTask = async (data, fileId = null) => {
    if (!token) return;

    const status = ["PENDING", "PROGRESS", "COMPLETED"].includes(data.status)
      ? data.status
      : "PENDING";

    try {
      const taskPayload = {
        title: data.title,
        projectId,
        status,
        modifiedBy: data.modifiedBy || "관리자",
        content: data.content || "기본 내용",
        editors: data.editors || ["user1"],
        deadline: data.deadline || "2025-07-11",
      };
      console.log("📤 taskPayload →", taskPayload); // ✅ 이거 추가

      const createdTask = await createTask(taskPayload);
      await fetchVersionList(createdTask.id);

      const versionData = {
        taskId: createdTask.id,
        title: createdTask.title,
        status,
        version: "1.0.0",
        modifiedBy: data.modifiedBy || "상명대생",
        content: data.content || "내용 공백",
        editors: data.editors || ["상명대"],
        deadline: data.deadline,
        projectId,
      };

      await createVersion(versionData, fileId);

      const versionHistory = await fetchVersionList(createdTask.id);
      const newTask = {
        ...createdTask,
        taskId: createdTask.id,
        status,
        versionHistory,
        currentVersion: versionHistory.at(-1)?.version,
      };

      if (status === "PENDING") {
        setTodoList((prev) => [...prev, newTask]);
      } else if (status === "PROGRESS") {
        setInProgressList((prev) => [...prev, newTask]);
      } else if (status === "COMPLETED") {
        setCompletedList((prev) => [...prev, newTask]);
      }

      return newTask;
    } catch (err) {
      setError("작업 생성 실패");
      console.error("작업 생성 실패:", err);
      throw err;
    }
  };

  // ✅작업 삭제
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      await loadTaskList(); // 삭제 후 목록 새로고침
      console.log("작업 삭제 O:", taskId);
    } catch (err) {
      console.error("작업 삭제 X:", err.message);
    }
  };

  // // ✅작업 로그 불러오기
  // const handleTaskLog = async (taskId) => {
  //   try {
  //     await fetchLogList(taskId, token);
  //   } catch (err) {
  //     console.error("로그 관리X", err.message);
  //   }
  // };

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

  // ✅자동 버전 증가
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

    const latest = versions[0];
    latest[2] += 1;
    return latest.join(".");
  };

  // ✅ 일반적인 자동 저장 로직 (파일 없이)
  const autoSaveTask = async (data) => {
    if (!data.title || !data.content || !data.deadline) return;
    try {
      if (data.taskId) {
        const history = await fetchVersionList(data.taskId);
        const nextVersion = getNextVersion(history);

        const versionData = {
          taskId: data.taskId,
          title: data.title,
          version: nextVersion,
          modifiedBy: data.modifiedBy || "관리자",
          content: data.content,
          editors: data.editors || ["user1"],
          deadline: data.deadline,
          projectId,
          status: data.status || "PENDING",
        };

        await createVersion(versionData);
        await loadTaskList();
      } else {
        await createNewTask(data);
      }
    } catch (err) {
      console.error("자동 저장 실패:", err);
    }
  };

  // ✅ 파일 추가 시 호출
  const saveTaskWithFile = async (data, file) => {
    if (!file) return;

    try {
      if (!data.taskId) {
        const created = await createTask(data, file);
        return created;
      }

      const uploadResult = await uploadFile(file, data.taskId);
      const history = await fetchVersionList(data.taskId);
      const nextVersion = getNextVersion(history);

      const versionData = {
        taskId: data.taskId,
        title: data.title,
        version: nextVersion,
        modifiedBy: data.modifiedBy || "관리자",
        content: data.content,
        editors: data.editors || ["user1"],
        deadline: data.deadline,
        projectId,
        status: data.status || "PENDING",
      };

      const { fileId, fileName } = uploadResult;
      if (!fileId || !fileName) {
        console.error("❌ fileId 또는 fileName 누락됨");
        return;
      }

      await createVersion(versionData, { fileId, fileName });
      await loadTaskList();
    } catch (err) {
      console.error("파일 포함 자동 저장 실패:", err);
    }
  };

  // ✅ 파일 삭제 후 버전 저장
  const saveTaskAfterFileDelete = async (data, fileId) => {
    if (!data.taskId || !fileId) return;
    try {
      const history = await fetchVersionList(data.taskId);
      const nextVersion = getNextVersion(history);

      const versionData = {
        taskId: data.taskId,
        title: data.title,
        version: nextVersion,
        modifiedBy: data.modifiedBy || "관리자",
        content: data.content,
        editors: data.editors || ["user1"],
        deadline: data.deadline,
        projectId,
        status: data.status || "PENDING",
      };

      await createVersion(versionData, { fileId });
      await loadTaskList();
    } catch (err) {
      console.error("파일 삭제 후 자동 저장 실패:", err);
    }
  };

  // ✅ 작업 상태 변경
  const changeStatus = async (taskId, newStatus) => {
    try {
      await changeTaskStatus(taskId, newStatus);
      await loadTaskList();
      console.log(`상태 변경 완료: ${taskId} → ${newStatus}`);
    } catch (err) {
      console.error("작업 상태 변경 실패", err);
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
