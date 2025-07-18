import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

// ✅ 임시 로그인
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    console.log(res.headers["access"]);
    return res.headers["access"];
  } catch (error) {
    console.error("❌ 로그인 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 목록 조회
export const fetchTaskList = async (token, projectId) => {
  try {
    const res = await axios.get(`${API_BASE}/task/list/get`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("❌ 작업 생성 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 버전 생성 (선택적으로 fileId 포함)
export const createVersion = async (versionData, token, fileInfo = null) => {
  let query = "";
  if (fileInfo?.fileId && !fileInfo.fileName) {
    // 파일 삭제 상황(파일 삭제 시 -> fileId 필요)
    query = `?fileId=${encodeURIComponent(fileInfo.fileId)}`;
  } else if (fileInfo?.fileId && fileInfo?.fileName) {
    // 파일 업로드 상황(파일 업로드 시 -> fileName,fileId 필요)
    query = `?fileId=${encodeURIComponent(fileInfo.fileId)}&fileName=${encodeURIComponent(fileInfo.fileName)}`;
  }
  try {
    const res = await axios.post(
      `${API_BASE}/task/version/save${query}`,
      versionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.error("❌ 버전 추가 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 삭제
export const deleteTask = async (taskId, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/task/delete`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { taskId },
    });
    return res.data;
  } catch (error) {
    console.error("❌ 로그 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 파일 업로드
export const uploadFile = async (file, taskId, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${API_BASE}/file/upload/${taskId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("파일 업로드 성공:", res.data.result);
    return res.data.result;
  } catch (error) {
    console.error(
      "❌ 파일 업로드 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ 파일 다운로드
export const fetchFileBlob = async (fileId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/file/download`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { fileId },
      responseType: "blob",
    });
    return {
      blob: res.data,
      headers: res.headers,
    };
  } catch (error) {
    console.error(
      "❌ 파일 다운로드 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ 파일 삭제
export const deleteFile = async (fileId, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/file/delete`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { fileId },
    });
    return res.data.result;
  } catch (error) {
    console.error("❌ 파일 삭제 실패:", error.response?.data || error.message);
    throw error;
  }
};
