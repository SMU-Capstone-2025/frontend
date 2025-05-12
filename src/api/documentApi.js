import axios from "axios";

// 전체 문서 목록 조회
export const fetchDocuments = async () => {
  try {
    const response = await axios.get("/api/documents");
    return response.data;
  } catch (error) {
    console.error("문서 목록 불러오기 실패:", error);
    throw new Error("문서 목록을 불러오지 못했습니다. 다시 시도해주세요.");
  }
};

// 문서 생성
export const createDocument = async (newDoc) => {
  try {
    const response = await axios.post("/api/documents", newDoc);
    return response.data;
  } catch (error) {
    console.error("문서 생성 실패:", error);
    throw new Error("문서를 저장하는 데 실패했습니다. 다시 시도해주세요.");
  }
};

// 문서 수정
export const updateDocument = async (id, updatedDoc) => {
  try {
    const response = await axios.put(`/api/documents/${id}`, updatedDoc);
    return response.data;
  } catch (error) {
    console.error("문서 수정 실패:", error);
    throw new Error("문서를 수정하는 데 실패했습니다. 다시 시도해주세요.");
  }
};

// 문서 삭제
export const deleteDocument = async (id) => {
  try {
    await axios.delete(`/api/documents/${id}`);
  } catch (error) {
    console.error("문서 삭제 실패:", error);
    throw new Error("문서를 삭제하는 데 실패했습니다. 다시 시도해주세요.");
  }
};

// 문서 개별 조회
export const fetchDocumentById = async (id) => {
  try {
    const response = await axios.get(`/api/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error("문서 불러오기 실패:", error);
    throw new Error("문서를 불러오는 데 실패했습니다. 다시 시도해주세요.");
  }
};
