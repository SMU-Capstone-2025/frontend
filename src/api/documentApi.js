import { axiosInstanceNoHeader } from "../apis/axiosInstance";

// 문서 개별 조회 API
export const fetchDocumentById = async (documentId) => {
  try {
    const res = await axiosInstanceNoHeader.get("/document/load", {
      params: { documentId },
    });
    return res.data.result;
  } catch (error) {
    console.error("문서 불러오기 실패:", error.response?.data || error.message);
    throw new Error("문서를 불러오는 데 실패했습니다. 다시 시도해주세요.");
  }
};

// 문서 전체 목록 조회 API
export const fetchDocumentList = async (projectId) => {
  try {
    const response = await axiosInstanceNoHeader.get("/document/load/list", {
      params: { projectId },
    });
    return response.data.result;
  } catch (error) {
    console.error(
      "문서 목록 불러오기 실패:",
      error.response?.data || error.message
    );
    throw new Error("문서 목록을 불러오는 데 실패했습니다.");
  }
};

// 문서 생성 API
export const createDocument = async (newDoc) => {
  try {
    const response = await axiosInstanceNoHeader.post("/document/post", newDoc);
    return response.data.result;
  } catch (error) {
    console.error("문서 생성 실패:", error.response?.data || error.message);
    throw new Error("문서를 저장하는 데 실패했습니다. 다시 시도해주세요.");
  }
};

// 문서 삭제 API
export const deleteDocument = async (documentId) => {
  try {
    await axiosInstanceNoHeader.delete("/document/delete", {
      params: { documentId },
    });
  } catch (error) {
    console.error("문서 삭제 실패:", error.response?.data || error.message);
    throw new Error("문서를 삭제하는 데 실패했습니다.");
  }
};

// AI 문서 요약
export const summarizeText = async ({ request }) => {
  try {
    const res = await axiosInstanceNoHeader.post("/ai/text/summarize", {
      request,
    });
    return res.data.result;
  } catch (error) {
    console.error("❌ 문서 요약 실패:", error.response?.data || error.message);
    throw error;
  }
};

// AI 문법 수정
export const correctText = async ({ request }) => {
  try {
    const res = await axiosInstanceNoHeader.post("/ai/text/correct", {
      request,
    });
    return res.data.result;
  } catch (error) {
    console.error("❌ 문서 요약 실패:", error.response?.data || error.message);
    throw error;
  }
};

// AI 요약 재수정
export const reviseSummary = async ({ request, reviseRequest }) => {
  try {
    const res = await axiosInstanceNoHeader.post("/ai/text/revise", {
      request,
      reviseRequest,
    });
    return res.data.result;
  } catch (error) {
    console.error("요약 재수정 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 문서 변경 로그 조회 API
export const fetchDocumentLogs = async (documentId, page = 1, size = 5) => {
  try {
    const res = await axiosInstanceNoHeader.get(
      `/document/logs/${documentId}`,
      {
        params: { page, size },
      }
    );
    return res.data.result;
  } catch (error) {
    console.error(
      "히스토리 불러오기 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 문서 상태 변경 API
export const updateDocumentStatus = async (documentId, status) => {
  try {
    const res = await axiosInstanceNoHeader.put("/document/status", null, {
      params: { documentId, status },
    });
    return res.data.result;
  } catch (error) {
    console.error(
      "문서 상태 변경 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};
