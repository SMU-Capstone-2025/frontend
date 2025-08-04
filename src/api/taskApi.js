import { axiosInstanceNoHeader } from "../apis/axiosInstance";

// ✅ 작업 목록 조회
export const fetchTaskList = async (projectId) => {
  try {
    const res = await axiosInstanceNoHeader.get("/task/list/get", {
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
export const createTask = async (taskData) => {
  try {
    const res = await axiosInstanceNoHeader.post("/task/post", taskData);
    return res.data.result;
  } catch (error) {
    console.error("❌ 작업 생성 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 버전 생성
export const createVersion = async (versionData, fileInfo = null) => {
  let query = "";
  if (fileInfo?.fileId && !fileInfo.fileName) {
    query = `?fileId=${encodeURIComponent(fileInfo.fileId)}`;
  } else if (fileInfo?.fileId && fileInfo?.fileName) {
    query = `?fileId=${encodeURIComponent(fileInfo.fileId)}&fileName=${encodeURIComponent(fileInfo.fileName)}`;
  }

  try {
    const res = await axiosInstanceNoHeader.post(
      `/task/version/save${query}`,
      versionData
    );
    return res.data.result;
  } catch (error) {
    console.error("❌ 버전 추가 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 삭제
export const deleteTask = async (taskId) => {
  try {
    const res = await axiosInstanceNoHeader.delete("/task/delete", {
      params: { taskId },
    });
    return res.data;
  } catch (error) {
    console.error("❌ 작업 삭제 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 작업 상세 조회
export const getTaskDetails = async (taskId) => {
  try {
    const res = await axiosInstanceNoHeader.get("/task/get", {
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
export const fetchVersionList = async (taskId) => {
  try {
    const res = await axiosInstanceNoHeader.get("/task/version/list", {
      params: { taskId },
    });
    return res.data.result;
  } catch (error) {
    console.error("❌ 버전 목록 실패:", error.response?.data || error.message);
    throw error;
  }
};
// ✅ 작업 상태 변경
export const changeTaskStatus = async (taskId, status) => {
  try {
    const res = await axiosInstanceNoHeader.put(
      "/task/status",
      {},
      {
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
export const fetchLogList = async (taskId) => {
  try {
    const res = await axiosInstanceNoHeader.get("/task/log", {
      params: { taskId },
    });
    return res.data;
  } catch (error) {
    console.error("❌ 로그 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 파일 업로드
export const uploadFile = async (file, taskId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstanceNoHeader.post(
      `/file/upload/${taskId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // FormData는 이거 따로 설정 필요
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
export const fetchFileBlob = async (fileId) => {
  try {
    const res = await axiosInstanceNoHeader.get("/file/download", {
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
export const deleteFile = async (fileId) => {
  try {
    const res = await axiosInstanceNoHeader.delete("/file/delete", {
      params: { fileId },
    });
    return res.data.result;
  } catch (error) {
    console.error("❌ 파일 삭제 실패:", error.response?.data || error.message);
    throw error;
  }
};
