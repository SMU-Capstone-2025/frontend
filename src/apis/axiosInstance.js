import axios from "axios";

const axiosInstanceNoHeader = axios.create({
  baseURL: "http://35.202.85.190:8080/",
});

let refreshPromise = null;

axiosInstanceNoHeader.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    //accessToken이 존재할 경우 Authorization 헤더에 추가
    if (accessToken && accessToken !== "undefined") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//응답 인터셉터: 401 에러 처리 -> refreshToken 을 이용한 토큰 갱신
axiosInstanceNoHeader.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401이고, 재시도 안 한 요청만 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      console.log("401 에러 발생");
      originalRequest._retry = true;

      // refreshToken 요청 자체가 401이면 로그아웃
      if (originalRequest.url === "/token/refresh") {
        console.log("리프레시 토큰 요청 중 401 에러 발생");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // window.location.href = "/login";
        return Promise.reject(error);
      }
      // //재시도 플래그 설정
      // originalRequest._retry = true;
      // console.log("refreshPromise", !refreshPromise);

      // refreshToken 요청이 진행중이라면, 그 Promise를 사용
      if (!refreshPromise) {
        console.log("리프레시 토큰 요청 시작"); //refresh 요청 실행 후 , 프로미스를 전역변수에 할당
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("리프레시 토큰", refreshToken);
        refreshPromise = axiosInstanceNoHeader
          .post("/token/refresh", {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          })
          .then((res) => {
            console.log("리프레시 토큰 응답", res, refreshPromise);
            const { access, refresh } = res.data;
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);
            console.log("리프레시 토큰 요청 성공", res);
            return access;
          })
          .catch((err) => {
            console.log("리프레시 토큰 요청 실패", err);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // window.location.href = "/login";
            return Promise.reject(err);
          })
          .finally(() => {
            refreshPromise = null; // 요청이 끝나면 프로미스 초기화
            console.log("리프레시 토큰 요청 종료");
          });

        return refreshPromise.then((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstanceNoHeader.request(originalRequest); // 재요청
        });
      }

      return Promise.reject(error); //기타 에러는 그대로 전달
    }
  }
);

export { axiosInstanceNoHeader };
