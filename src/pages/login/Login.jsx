import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Button from "../../components/Button/Button";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import Layout from "../../components/NavbarLayout/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getLoginToken = async (email, password) => {
    try {
      const res = await axiosInstanceNoHeader.post("/login", {
        email: email,
        password: password,
      });
      console.log("로그인 성공~!\n", res);
      alert("로그인 되었습니다");
      window.location.href = "/";
      return res.headers;
    } catch (error) {
      console.log("로그인 실패~!\n", error);
      alert("로그인에 실패했습니다");
      window.location.href = "/login";
      return error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await getLoginToken(email, password);
      console.log("보낸 바디:", email, password);
      console.log("받은 응답", res);

      localStorage.setItem("accessToken", res.access);
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("refreshToken", res.refresh);

      console.log("axiosInstanceNoHeader", axiosInstanceNoHeader);
    } catch (error) {
      console.log("에러 발생", error);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-12 pt-16 px-4 z-10">
        <div className="flex w-[700.92px] h-[760px] relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden py-[105px] px-24">
          <div className="w-10 h-10 absolute rounded-2xl left-[610px] top-[51px] cursor-pointer">
            <CloseOn />
          </div>
          <div className="w-full h-[550px] flex flex-col justify-start items-center gap-7">
            <div className="w-full h-full flex flex-col justify-start items-end gap-14">
              <div className="w-full h-full flex flex-col justify-start items-center gap-14">
                {/* loginContentContainer */}
                <div className="flex justify-start text-gray-900 text-3xl font-bold font-['Pretendard'] leading-loose">
                  로그인
                </div>
                <form
                  action=""
                  onSubmit={handleSubmit}
                  className="w-full h-full flex flex-col justify-start items-start gap-9"
                >
                  <div className="flex flex-col justify-start items-start gap-3">
                    {/* id, pw등 input 감싸는 컨테이너*/}
                    <div className="flex flex-col justify-start items-start gap-6">
                      {/*input list id,pw등등*/}
                      <div className="w-full h-full flex flex-col justify-start items-start gap-1">
                        <div className="justify-start text-gray-800 text-base font-semibold font-['Pretendard']">
                          아이디
                        </div>
                        <input
                          className="w-full h-12 py-3 px-4 rounded-lg outline outline-1 outline-gray-300 overflow-hidden"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="이메일을 입력해주세요"
                          required
                        />
                      </div>
                      <div className="w-full h-full flex flex-col justify-start items-start gap-1">
                        <div className="justify-start text-gray-800 text-base font-semibold font-['Pretendard']">
                          비밀번호
                        </div>
                        <input
                          className="w-[520px] h-12 py-3 px-4 rounded-lg outline outline-1 outline-gray-300 overflow-hidden"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="8자리 이상의 비밀번호를 입력해주세요"
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center gap-4">
                      <label
                        htmlFor="rememberLoginInfo"
                        className="flex justify-start items-center gap-2 cursor-pointer"
                      >
                        <input
                          id="rememberLoginInfo"
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                        />
                        <div className="justify-start text-gray-800 text-base font-semibold font-['Pretendard']">
                          로그인 정보 기억하기
                        </div>
                      </label>
                      <div className="justify-end cursor-pointer text-sky-600 text-sm font-normal font-['Pretendard'] leading-tight">
                        비밀번호를 잊어버리셨나요?
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start gap-11">
                    {/* 소셜로그인 버튼과 로그인버튼 감싸는 박스*/}
                    {/* 구글 카톡 깃허브 */}
                    <button
                      type="submit"
                      className="w-full h-12 cursor-pointer"
                    >
                      <Button
                        width={"100%"}
                        height={"100%"}
                        text={"로그인 하기"}
                      />
                    </button>
                  </div>
                  <div className="self-stretch text-center justify-start">
                    <span class="text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight">
                      아직 계정이 없나요?{" "}
                    </span>
                    <span class="cursor-pointer text-sky-600 text-sm font-normal font-['Pretendard'] leading-tight">
                      <a href="/signup"> 회원가입 하기</a>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
