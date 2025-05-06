import axios from "axios";

const axiosInstanceNoHeader = axios.create({
  baseURL: "http://35.202.85.190:8080/",
});

const plainAxios = axios.create(); // refresh에만 쓰는 인스턴스

let refreshPromise = null;

axiosInstanceNoHeader.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && accessToken !== "undefined") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceNoHeader.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // refresh 요청 자체가 실패한 경우
      // if (originalRequest.url.includes("/token/refresh")) {
      //   localStorage.removeItem("accessToken");
      //   localStorage.removeItem("refreshToken");
      //   window.location.href = "/login"; // 로그인 페이지로 리다이렉트
      //   return Promise.reject(error);
      // }

      // 이미 refresh 진행 중이면 해당 Promise 기다림
      if (!refreshPromise) {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("refreshTokenasdfasdf", refreshToken);
        // 여기에 추가해보셈
        if (!refreshToken || refreshToken === "undefined") {
          console.warn("refreshToken이 유효하지 않음:", refreshToken);
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject("No refreshToken");
        }
        // refresh 요청 실행
        refreshPromise = plainAxios
          .post("http://35.202.85.190:8080/token/refresh", null, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          })
          .then((res) => {
            console.log("refreshToken 성공", res);

            const { access, refresh } = res.data;
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);
            return access;
          })
          .catch((err) => {
            console.log("refreshToken 실패", err);
            // refresh 실패 시 토큰 제거
            // localStorage.removeItem("accessToken");
            // localStorage.removeItem("refreshToken");
            throw err;
          })
          .finally(() => {
            refreshPromise = null; // 꼭 초기화!
          });
      }

      try {
        const newAccessToken = await refreshPromise;
        console.log("newAccessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstanceNoHeader(originalRequest); // 재요청
      } catch (err) {
        console.log("newAccessTokenas", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstanceNoHeader };
