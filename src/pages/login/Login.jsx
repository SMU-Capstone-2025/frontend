import React, { useState } from "react";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Button from "../../components/Button/Button";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import Layout from "../../components/NavbarLayout/Layout";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getLoginToken = async (email, password) => {
    try {
      const res = await axiosInstanceNoHeader.post("/login", {
        email,
        password,
      });
      alert("로그인 되었습니다");
      navigate("/");
      return res.headers;
    } catch (error) {
      console.log("로그인 실패~!\n", error);
      alert("로그인에 실패했습니다");
      navigate("/login");
      return error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await getLoginToken(email, password);
      localStorage.setItem("accessToken", res.access);
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("refreshToken", res.refresh);
    } catch (error) {
      console.log("에러 발생", error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full px-4 pt-12 sm:px-6 md:px-8 lg:px-12 sm:pt-16">
        <div className="relative bg-white rounded-xl outline outline-1 outline-gray-300 overflow-hidden w-full max-w-[700px] min-h-[500px] sm:min-h-[600px] md:min-h-[680px] lg:min-h-[760px] py-10 sm:py-14 md:py-16 lg:py-[105px] px-6 sm:px-10 md:px-16 lg:px-24">
          {/* 컨텐츠 */}
          <div className="flex flex-col items-center justify-start h-full gap-8 sm:gap-10 lg:gap-14">
            <div className="w-full text-gray-900 text-2xl sm:text-3xl font-bold font-['Palanquin'] leading-loose text-center sm:text-center ">
              로그인
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start justify-start w-full gap-7 sm:gap-9"
            >
              <div className="flex flex-col w-full gap-6">
                <Input
                  title={"아이디"}
                  type={"text"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={"이메일을 입력해주세요"}
                />
                <Input
                  title={"비밀번호"}
                  type={"password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={"8자리 이상의 비밀번호를 입력해주세요"}
                />
              </div>

              {/* 옵션 */}
              <div className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row sm:items-center">
                <label
                  htmlFor="rememberLoginInfo"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="rememberLoginInfo"
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-gray-800 text-sm sm:text-base font-semibold font-['Palanquin']">
                    로그인 정보 기억하기
                  </span>
                </label>
                <a
                  href="/password-reset"
                  className="text-sky-600 text-sm sm:text-base font-normal font-['Palanquin'] leading-tight cursor-pointer"
                >
                  비밀번호를 잊어버리셨나요?
                </a>
              </div>

              {/* 버튼 */}
              <div className="w-full h-12">
                <Button
                  type={"submit"}
                  width={"100%"}
                  height={"100%"}
                  text={"로그인 하기"}
                />
              </div>

              {/* 회원가입 */}
              <div className="self-stretch text-center">
                <span className="text-gray-800 text-sm font-normal font-['Palanquin'] leading-tight">
                  아직 계정이 없으신가요?{" "}
                </span>
                <a
                  href="/signup"
                  className="text-sky-600 text-sm font-normal font-['Palanquin'] leading-tight cursor-pointer"
                >
                  회원가입 하기
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
