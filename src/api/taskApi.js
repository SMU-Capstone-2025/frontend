// taskApi.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

/*
  error.response?.data => 백엔드에서 보내준 에러 메시지(ex: 401, 500 오류)
  error.message => 네트워크 자체 에러일 때 메시지(ex: timeout, 연결 실패 등)
  throw error => 위에서 에러를 한 번 처리한 뒤, 
  다시 상위로 던져줌(호출한 쪽에서 또 try-catch 할 수 있도록)
*/

// 로그인 API
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/login`, {
      email: email,
      password: password,
    });

    const token = res.headers["access"];
    return token;
  } catch (error) {
    console.error("로그인 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 작업 리스트 불러오기 API
export const fetchTaskList = async (token, projectId) => {
  try {
    const res = await axios.get(`${API_BASE}/task/list/get`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        projectId: projectId,
      },
    });
    console.log(res.data);
    return res.data; // 전체 작업 배열
  } catch (error) {
    console.error("목록 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 작업 생성 API
export const createTask = async (taskData, token) => {
  try {
    const res = await axios.post(`${API_BASE}/task/post`, taskData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("작업 생성 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 작업 내 신규 버전 추가 API
export const createVersion = async (versionRequestData, token) => {
  try {
    const res = await axios.post(
      `${API_BASE}/task/version/save`,
      versionRequestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("버전 추가 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 작업 삭제 API
export const deleteTask = async (taskId, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/task/delete`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        taskId: taskId,
      },
    });
    return res.data;
  } catch (error) {
    console.error("작업 삭제 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 작업 세부 정보 조회 API
export const getTaskDetails = async (taskId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/task/get`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        taskId: taskId,
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "작업 세부 정보 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 버전 히스토리 API
export const fetchVersionList = async (taskId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/task/version/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        taskId: taskId,
      },
    });
    return res.data.result; // 버전 배열
  } catch (error) {
    console.error(
      "❌ 버전 히스토리 불러오기 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};
