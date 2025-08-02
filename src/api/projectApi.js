import { axiosInstanceNoHeader } from "../apis/axiosInstance";

// ✅ 프로젝트 세부 내용 조회
export const fetchProject = async (projectId) => {
  try {
    console.log("-> 요청 projectId:", projectId);
    const res = await axiosInstanceNoHeader.get("/project/load", {
      params: { projectId },
    });
    console.log("프로젝트 조회", res.data.result);
    return res.data;
  } catch (error) {
    console.error("프로젝트 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 프로젝트에 신규 인원 추가
export const inviteMembersToProject = async ({ projectId, authorities }) => {
  try {
    console.log("서버로 보낼 데이터:", {
      projectId,
      authorities,
    });

    const res = await axiosInstanceNoHeader.put(
      `project/invite/${projectId}`,
      {
        authorities,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("초대 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 프로젝트 정보 업데이트
export const updateProject = async (
  projectId,
  projectName,
  description,
  imageId = null
) => {
  try {
    const res = await axiosInstanceNoHeader.put(
      `/project/update/${projectId}`,
      {
        projectName,
        description,
        imageId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "프로젝트 업데이트 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ 프로젝트 내 권한 변경
export const updateProjectAuthorities = async (projectId, userEmail, role) => {
  try {
    const res = await axiosInstanceNoHeader.put(`/project/auth/${projectId}`, {
      userEmail,
      role,
    });
    return res.data;
  } catch (error) {
    console.error("권한 변경 실패:", error.response?.data || error.message);
    throw error;
  }
};
