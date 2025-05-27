import React, { useState } from "react";
import Layout from "../../components/NavbarLayout/Layout";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import CloseOn from "../../assets/icons/Close/CloseOn";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePasswordResetSubmit = async (e) => {};

  const getEmailAvailCheck = async (email) => {
    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      console.log("이메일 유효성 검사 실패", isValidEmail);
      setEmaiSuccess(false);
    } else {
      try {
        const res = await axiosInstanceNoHeader.get("/register/avail-check", {
          params: {
            email: email,
          },
        });
        console.log("이메일 중복 체크 성공~!사용가능한 이메일입니다\n", res);
        setEmaiSuccess(true);
        return res;
      } catch (error) {
        console.log("이메일 중복 체크 실패~!\n", error.response.data.message);
        setEmaiSuccess(false);
        return error;
      }
    }
  };
  const getAuthCode = async (email) => {
    try {
      const res = await axiosInstanceNoHeader.get("/register/mail-check", {
        params: {
          email: email,
        },
      });
      console.log("인증번호 받기 성공~!", res);
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
      console.log("보낸 메일:", email);
      console.log("받은 코드", authCode.data.result);
      setServerAuthCode(authCode.data.result);
    } catch (e) {
      console.log(e);
    }
  };

  const checkAuthCode = (userAuthCode) => {
    // 인증번호 체크
    if (userAuthCode === serverAuthCode) {
      console.log("유저,서버 인증코드 일치 성공~!");
      setUserAuthCodeSuccess(true);
      setDisplayPasswordResetBtn(true);
    } else if (userAuthCode !== serverAuthCode) {
      console.log("유저,서버 인증코드 불일치. 유저코드: ", userAuthCode);
      console.log("서버코드: ", serverAuthCode);
      setUserAuthCodeSuccess(false);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-12 pt-16 px-4 z-10">
        <div className="flex w-[700.92px] h-fit relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-300 py-[105px] px-24">
          <div className="w-10 h-10 absolute rounded-2xl left-[610px] top-[51px] cursor-pointer">
            <CloseOn />
          </div>
          <div className="w-full h-full flex flex-col justify-start items-center gap-7">
            <div className="w-full h-full flex flex-col justify-start items-center gap-14">
              {/* loginContentContainer */}
              <div className="flex justify-start text-gray-900 text-3xl font-bold font-['Pretendard'] leading-loose">
                비밀번호 재설정
              </div>
              <form
                action=""
                onSubmit={handlePasswordResetSubmit}
                className="w-full h-full flex flex-col justify-start items-start gap-9"
              >
                <Input
                  type={"text"}
                  placeholder={"성함을 입력해주세요."}
                  title={"이름"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type={"email"}
                  placeholder={"이메일을 입력해주세요."}
                  title={"아이디"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => getEmailAvailCheck(email)}
                  onSuccess={emailSuccess}
                />
                {!displayPasswordResetBtn && (
                  <button
                    type="button"
                    id="btnSubmitAuth"
                    onClick={handleSubmitAuthCode}
                    className="w-full h-full cursor-pointer"
                  >
                    <Button
                      width={"100%"}
                      height={"100%"}
                      text={"인증번호 전송"}
                    />
                  </button>
                )}
                {serverAuthCode && (
                  <Input
                    type={"text"}
                    placeholder={"인증번호를 입력해주세요."}
                    title={"인증번호"}
                    value={userAuthCode}
                    onChange={(e) => setUserAuthCode(e.target.value)}
                    onBlur={() => checkAuthCode(userAuthCode)}
                    onSuccess={userAuthCodeSuccess}
                  />
                )}
                {displayPasswordResetBtn && (
                  <Input
                    type={"password"}
                    placeholder={"비밀번호를 입력해주세요."}
                    title={"비밀번호"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
                {displayPasswordResetBtn && (
                  <Input
                    type={"password"}
                    placeholder={"비밀번호를 한번 더 입력해주세요."}
                    title={"비밀번호 확인"}
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
                )}
                {displayPasswordResetBtn && (
                  <button
                    type="submit"
                    id="btnSubmitJoin"
                    className="w-full h-full cursor-pointer"
                  >
                    <Button
                      width={"100%"}
                      height={"100%"}
                      text={"비밀번호 재설정하기"}
                    />
                  </button>
                )}
                {/* <Input
                  type={"password"}
                  placeholder={"비밀번호를 입력해주세요."}
                  title={"비밀번호"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type={"password"}
                  placeholder={"비밀번호를 한번 더 입력해주세요."}
                  title={"비밀번호 확인"}
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
                    type={"text"}
                    placeholder={"인증번호를 입력해주세요."}
                    title={"인증번호"}
                    value={userAuthCode}
                    onChange={(e) => setUserAuthCode(e.target.value)}
                    onBlur={() => checkAuthCode(userAuthCode)}
                    onSuccess={userAuthCodeSuccess}
                  />
                )}
                {!displaySignupBtn && (
                  <button
                    type="button"
                    id="btnSubmitAuth"
                    onClick={handleSubmitAuthCode}
                    className="w-full h-full cursor-pointer"
                  >
                    <Button
                      width={"100%"}
                      height={"100%"}
                      text={"인증번호 전송"}
                    />
                  </button>
                )}
                {displaySignupBtn && (
                  <button
                    type="submit"
                    id="btnSubmitJoin"
                    className="w-full h-full cursor-pointer"
                  >
                    <Button
                      width={"100%"}
                      height={"100%"}
                      text={"회원가입하기"}
                    />
                  </button>
                )} */}
              </form>
              <div className="self-stretch text-center justify-start">
                <span class="text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight">
                  아직 가입한 계정이 없으신가요?{" "}
                </span>
                <span class="cursor-pointer text-sky-700 text-sm font-normal font-['Pretendard'] leading-tight">
                  {/* <a href="/"></a> */}
                  회원가입하기
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
