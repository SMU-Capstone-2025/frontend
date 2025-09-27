import React, { useState } from "react";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import Layout from "../../components/NavbarLayout/Layout";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [serverAuthCode, setServerAuthCode] = useState("");
  const [userAuthCode, setUserAuthCode] = useState("");
  const [displaySignupBtn, setDisplaySignupBtn] = useState(false);
  const [emailSuccess, setEmaiSuccess] = useState(null);
  const [passwordCheckSuccess, setpasswordCheckSuccess] = useState(null);
  const [userAuthCodeSuccess, setUserAuthCodeSuccess] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getEmailAvailCheck = async (email) => {
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      setEmaiSuccess(false);
    } else {
      try {
        const res = await axiosInstanceNoHeader.get("/register/avail-check", {
          params: { email },
        });
        setEmaiSuccess(true);
        return res;
      } catch (error) {
        console.log("실패, 서버 메세지:\n", error.response.data.message);
        setEmaiSuccess(false);
        return error;
      }
    }
  };

  const getAuthCode = async (email) => {
    try {
      const res = await axiosInstanceNoHeader.get("/register/mail-check", {
        params: { email },
      });
      return res;
    } catch (e) {
      console.log("인증번호받기 실패~!", e);
      return e;
    }
  };

  const handleSubmitAuthCode = async (e) => {
    e.preventDefault();
    try {
      const authCode = await getAuthCode(email);
      setServerAuthCode(authCode.data.result);
    } catch (e) {
      console.log(e);
    }
  };

  const checkAuthCode = (userAuthCode) => {
    if (userAuthCode === serverAuthCode) {
      setUserAuthCodeSuccess(true);
      setDisplaySignupBtn(true);
    } else {
      setUserAuthCodeSuccess(false);
    }
  };

  const signupapi = async (name, email, password) => {
    try {
      const res = await axiosInstanceNoHeader.post("/register/new", {
        name,
        email,
        password,
      });
      alert("회원가입이 완료되었습니다");
      navigate("/login");
      return res;
    } catch (e) {
      console.log("회원가입요청 실패~ㅠ", e);
      alert("회원가입에 실패했습니다");
      navigate("/signup");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupapi(name, email, password);
    } catch (e) {
      console.log("handleSubmit에러", e);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-12 pt-16 px-4 z-10">
        <div className="flex w-full max-w-[700px] h-fit relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-300 py-10 sm:py-[105px] px-6 sm:px-12 md:px-24">
          {/* 닫기 버튼 */}
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 absolute right-6 top-6 sm:right-[40px] sm:top-[40px] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <CloseOn />
          </div>

          <div className="w-full h-full flex flex-col justify-start items-center gap-7">
            <div className="w-full h-full flex flex-col justify-start items-center gap-10 sm:gap-14">
              {/* 타이틀 */}
              <div className="flex justify-center sm:justify-center w-full text-gray-900 text-2xl sm:text-3xl font-bold font-['Palanquin'] leading-loose">
                회원가입
              </div>

              {/* 폼 */}
              <form onSubmit={handleSignupSubmit} className="w-full">
                <div className="w-full flex flex-col justify-start items-start gap-6 sm:gap-9">
                  <Input
                    type="text"
                    placeholder="성함을 입력해주세요."
                    title="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="이메일을 입력해주세요."
                    title="아이디"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => getEmailAvailCheck(email)}
                    onSuccess={emailSuccess}
                  />
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    title="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="비밀번호를 한번 더 입력해주세요."
                    title="비밀번호 확인"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    onBlur={() => {
                      if (password === passwordCheck) {
                        setpasswordCheckSuccess(true);
                      } else {
                        setpasswordCheckSuccess(false);
                      }
                    }}
                    onSuccess={passwordCheckSuccess}
                  />
                  {serverAuthCode && (
                    <Input
                      type="text"
                      placeholder="인증번호를 입력해주세요."
                      title="인증번호"
                      value={userAuthCode}
                      onChange={(e) => setUserAuthCode(e.target.value)}
                      onBlur={() => checkAuthCode(userAuthCode)}
                      onSuccess={userAuthCodeSuccess}
                    />
                  )}
                  {!displaySignupBtn && (
                    <div
                      id="btnSubmitAuth"
                      onClick={handleSubmitAuthCode}
                      className="w-full cursor-pointer"
                    >
                      <Button
                        type="button"
                        width="100%"
                        height="48px"
                        text="인증번호 전송"
                      />
                    </div>
                  )}
                  {displaySignupBtn && (
                    <div id="btnSubmitJoin" className="w-full cursor-pointer">
                      <Button
                        type="submit"
                        width="100%"
                        height="48px"
                        text="회원가입하기"
                      />
                    </div>
                  )}
                </div>
              </form>

              {/* 하단 링크 */}
              <div className="self-stretch text-center">
                <span className="text-gray-800 text-sm font-normal font-['Palanquin'] leading-tight">
                  가입한 계정이 있으신가요?{" "}
                </span>
                <span className="cursor-pointer text-sky-700 text-sm font-normal font-['Palanquin'] leading-tight">
                  <a href="/password-reset">비밀번호 재설정하기</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
