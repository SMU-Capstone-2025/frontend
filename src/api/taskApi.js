import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

// ✅ 공통 헤더 생성 함수
const getAuthHeaders = (token, contentType = "application/json") => ({
  "Content-Type": contentType,
  Authorization: `Bearer ${token}`,
});

// ✅ 임시 로그인
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    const token = res.headers["access"];
    console.log("로그인 성공:", token);
    return token;
  } catch (error) {
    console.error("❌ 로그인 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 목록 조회
export const fetchTaskList = async (token, projectId) => {
  try {
    const res = await axios.get(`${API_BASE}/task/list/get`, {
      headers: getAuthHeaders(token),
      params: { projectId },
    });
    console.log("작업 목록:", res.data.result);
    return res.data;
  } catch (error) {
    console.error("❌ 작업 목록 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 생성
export const createTask = async (taskData, token) => {
  try {
    const res = await axios.post(`${API_BASE}/task/post`, taskData, {
      headers: getAuthHeaders(token),
    });
    return res.data.result;
  } catch (error) {
    console.error("❌ 작업 생성 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 버전 생성
export const createVersion = async (versionData, token) => {
  try {
    const res = await axios.post(`${API_BASE}/task/version/save`, versionData, {
      headers: getAuthHeaders(token),
    });
    return res.data;
  } catch (error) {
    console.error("❌ 버전 추가 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 삭제
export const deleteTask = async (taskId, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/task/delete`, {
      headers: getAuthHeaders(token),
      params: { taskId },
    });
    return res.data;
  } catch (error) {
    console.error("❌ 작업 삭제 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 상세 조회
export const getTaskDetails = async (taskId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/task/get`, {
      headers: getAuthHeaders(token),
      params: { taskId },
    });
    return res.data;
  } catch (error) {
    console.error(
      "❌ 작업 세부 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ 버전 목록 조회
export const fetchVersionList = async (taskId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/task/version/list`, {
      headers: getAuthHeaders(token),
      params: { taskId },
    });
    return res.data.result;
  } catch (error) {
    console.error("❌ 버전 목록 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 상태 변경
export const changeTaskStatus = async (taskId, status, token) => {
  try {
    const res = await axios.put(
      `${API_BASE}/task/status`,
      {},
      {
        headers: getAuthHeaders(token),
        params: { taskId, status },
      }
    );
    return res.data;
  } catch (error) {
    console.error("❌ 상태 변경 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 로그 목록 조회
export const fetchLogList = async (taskId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/task/log`, {
      headers: getAuthHeaders(token),
      params: { taskId },
    });
    return res.data;
  } catch (error) {
    console.error("❌ 로그 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 파일 업로드
export const uploadFile = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_BASE}/file/upload`, formData, {
      headers: getAuthHeaders(token, "multipart/form-data"),
    });

    return res.data.result;
  } catch (error) {
    console.error(
      "❌ 파일 업로드 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// // ✅ 파일 다운로드
// export const downloadFile = async (fileId, token) => {
//   try {
//     const res = await axios.get(`${API_BASE}/file/download`, {
//       headers: getAuthHeaders(token),
//       params: { fileId },
//       responseType: "blob",
//     });

//     return res.data;
//   } catch (error) {
//     console.error("❌ 파일 다운로드 실패:", error.response?.data || error.message);
//     throw error;
//   }
// };
