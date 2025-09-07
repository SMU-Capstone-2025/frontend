import { axiosInstanceNoHeader } from "../apis/axiosInstance";

// 내부 상태 공유
let refreshPromise = null;

export const getValidAccessToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken && accessToken !== "undefined") {
    return accessToken;
  }

  if (!refreshToken || refreshToken === "undefined") {
    console.warn("refreshToken이 유효하지 않음:", refreshToken);
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("No refreshToken");
  }

  if (!refreshPromise) {
    refreshPromise = axiosInstanceNoHeader
      .post("/token/refresh", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .then((res) => {
        const { access, refresh } = res.headers;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        return access;
      })
      .catch((err) => {
        console.error("refreshToken 실패", err);
        localStorage.clear();
        window.location.href = "/login";
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return await refreshPromise;
};
