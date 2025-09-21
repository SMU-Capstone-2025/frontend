import React, { useState } from "react";
import Layout from "../../components/NavbarLayout/Layout";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import CloseOn from "../../assets/icons/Close/CloseOn";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [serverAuthCode, setServerAuthCode] = useState("");
  const [userAuthCode, setUserAuthCode] = useState("");
  const [displayPasswordResetBtn, setDisplayPasswordResetBtn] = useState(false);
  const [emailSuccess, setEmaiSuccess] = useState(null);
  const [passwordCheckSuccess, setpasswordCheckSuccess] = useState(null);
  const [userAuthCodeSuccess, setUserAuthCodeSuccess] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePasswordResetApi = async (email, password, passwordCheck) => {
    try {
      const res = await axiosInstanceNoHeader.put("/mypage/password/new", {
        email: email,
        password: password,
        passwordCheck: passwordCheck,
      });
      alert("비밀번호가 재설정되었습니다.");
      return res;
    } catch (err) {
      console.log("비밀번호 재설정 실패~!", err);
      return err;
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await handlePasswordResetApi(email, password, passwordCheck);
    } catch (error) {
      console.log("에러 발생", error);
    }
  };

  const getEmailAvailCheck = async (name, email) => {
    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      setEmaiSuccess(false);
    } else {
      try {
        const res = await axiosInstanceNoHeader.get("/mypage/email/avail", {
          params: {
            name: name,
            email: email,
          },
        });
        setEmaiSuccess(true);
        return res;
      } catch (error) {
        console.log("이메일 존재여부 확인 실패", error);
        setEmaiSuccess(false);
        return error;
      }
    }
  };

  const getAuthCode = async (email) => {
    try {
      const res = await axiosInstanceNoHeader.post("/mypage/email/check", {
        email: email,
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
    // 인증번호 체크
    if (userAuthCode === serverAuthCode) {
      setUserAuthCodeSuccess(true);
      setDisplayPasswordResetBtn(true);
    } else {
      setUserAuthCodeSuccess(false);
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
                비밀번호 재설정
              </div>

              {/* 폼 */}
              <form onSubmit={handlePasswordResetSubmit} className="w-full">
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
                    onBlur={() => getEmailAvailCheck(name, email)}
                    onSuccess={emailSuccess}
                  />

                  {/* 인증번호 전송 버튼 */}
                  {!displayPasswordResetBtn && (
                    <div
                      id="btnSubmitAuth"
                      onClick={emailSuccess ? handleSubmitAuthCode : undefined}
                      className="w-full cursor-pointer"
                    >
                      <Button
                        type="button"
                        width="100%"
                        height="48px"
                        text="인증번호 전송"
                        disabled={!emailSuccess}
                        color={emailSuccess ? null : "#d2d5da"}
                      />
                    </div>
                  )}

                  {/* 인증번호 입력 */}
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

                  {/* 비밀번호 입력 섹션 */}
                  {displayPasswordResetBtn && (
                    <div className="w-full flex flex-col justify-start items-start gap-6 sm:gap-9">
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
                      <div id="btnSubmitJoin" className="w-full cursor-pointer">
                        <Button
                          type="submit"
                          width="100%"
                          height="48px"
                          text="비밀번호 재설정하기"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </form>

              {/* 하단 링크 */}
              <div className="self-stretch text-center">
                <span className="text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight">
                  아직 가입한 계정이 없으신가요?{" "}
                </span>
                <span className="cursor-pointer text-sky-700 text-sm font-normal font-['Pretendard'] leading-tight">
                  <a href="/signup">회원가입하기</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordReset;
