// useTaskColumn.js
import { useState, useEffect } from "react";
import {
  login,
  createTask,
  createVersion,
  fetchTaskList,
  deleteTask,
  getTaskDetails,
  fetchVersionList,
  changeTaskStatus,
  //fetchLogList,
  uploadFile,
  deleteFile,
} from "../api/taskApi";

const useTaskColumn = () => {
  const [todoList, setTodoList] = useState([]);
  const [inProgressList, setInProgressList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const projectId = "687519535c29ce3bfec23162"; // 임시 프로젝트 ID

  // ✅로그인 후 토큰 저장(처음 실행시) + 작업 목록 불러오기
  useEffect(() => {
    const init = async () => {
      if (token) return; // 이미 토큰 있으면 실행 안 함
      try {
        const loggedInToken = await login("qwe123@naver.com", "qwe123");
        setToken(loggedInToken);
        localStorage.setItem("token", loggedInToken);
        await loadTaskList(loggedInToken, projectId);
      } catch (error) {
        setError("로그인 실패!");
      }
    };
    init();
  }, [token]);

  // ✅전체 작업 목록 불러오기 및 컬럼별 분류
  const loadTaskList = async (authToken = token) => {
    if (!authToken) return;
    try {
      const { result } = await fetchTaskList(authToken, projectId);

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
        projectId: data.projectId,
        status,
        modifiedBy: data.modifiedBy || "관리자",
        content: data.content || "기본 내용",
        editors: data.editors || ["user1"],
        deadline: data.deadline || "2025-07-11",
      };

      const createdTask = await createTask(taskPayload, token);
      console.log("createTask:", createdTask);
      const history = await fetchVersionList(createdTask.id, token);
      console.log("📜 version history:", history);

      const versionData = {
        taskId: createdTask.id,
        title: createdTask.title,
        status,
        version: "1.0.0", // 처음은 무조건 1.0.0
        modifiedBy: data.modifiedBy || "상명대생",
        content: data.content || "내용 공백",
        editors: data.editors || "상명대",
        deadline: data.deadline,
        attachmentList: [],
      };
      // ✅작업 추가 -> 버전 추가
      await createVersion(versionData, token, fileId);
      const versionHistory = await fetchVersionList(createdTask.id, token);
      const newTask = {
        ...createdTask,
        taskId: createdTask.id,
        status,
        versionHistory,
        currentVersion: versionHistory.at(-1)?.version,
      };

      // 상태에 따라 해당 컬럼 리스트에 추가
      if (status === "PENDING") {
        setTodoList((prev) => [...prev, newTask]);
      } else if (status === "PROGRESS") {
        setInProgressList((prev) => [...prev, newTask]);
      } else if (status === "COMPLETED") {
        setCompletedList((prev) => [...prev, newTask]);
      }
    } catch (err) {
      setError("작업 생성 실패");
      console.error("작업 생성 실패:", err);
      throw err;
    }
  };

  // ✅작업 삭제
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId, token);
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
      const res = await getTaskDetails(taskId, token);
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
        const history = await fetchVersionList(data.taskId, token);
        const nextVersion = getNextVersion(history);

        const versionData = {
          taskId: data.taskId,
          title: data.title,
          version: nextVersion,
          modifiedBy: data.modifiedBy || "관리자",
          content: data.content,
          editors: data.editors || ["user1"],
          deadline: data.deadline,
          projectId: data.projectId,
          status: data.status || "PENDING",
        };

        await createVersion(versionData, token);
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
    if (!data.taskId || !file) return;
    try {
      const uploadResult = await uploadFile(file, data.taskId, token); // { fileId, fileName }
      const history = await fetchVersionList(data.taskId, token);
      const nextVersion = getNextVersion(history);

      const versionData = {
        taskId: data.taskId,
        title: data.title,
        version: nextVersion,
        modifiedBy: data.modifiedBy || "관리자",
        content: data.content,
        editors: data.editors || ["user1"],
        deadline: data.deadline,
        projectId: data.projectId,
        status: data.status || "PENDING",
      };

      await createVersion(versionData, token, uploadResult);
      await loadTaskList();
    } catch (err) {
      console.error("파일 포함 자동 저장 실패:", err);
    }
  };

  // ✅ 파일 삭제 후 버전 저장
  const saveTaskAfterFileDelete = async (data, fileId) => {
    if (!data.taskId || !fileId) return;
    try {
      const history = await fetchVersionList(data.taskId, token);
      const nextVersion = getNextVersion(history);

      const versionData = {
        taskId: data.taskId,
        title: data.title,
        version: nextVersion,
        modifiedBy: data.modifiedBy || "관리자",
        content: data.content,
        editors: data.editors || ["user1"],
        deadline: data.deadline,
        projectId: data.projectId,
        status: data.status || "PENDING",
      };

      await createVersion(versionData, token, { fileId });
      await loadTaskList();
    } catch (err) {
      console.error("파일 삭제 후 자동 저장 실패:", err);
    }
  };

  // ✅ 작업 상태 변경
  const changeStatus = async (taskId, newStatus) => {
    try {
      await changeTaskStatus(taskId, newStatus, token);
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
