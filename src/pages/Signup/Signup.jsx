import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [serverAuthCode, setServerAuthCode] = useState("");
  const [userAuthCode, setUserAuthCode] = useState("");
  const [displaySignupBtn, setDisplaySignupBtn] = useState(false);

  const getEmailAvailCheck = async (email) => {
    try {
      const res = await axiosInstanceNoHeader.get("/register/avail-check", {
        params: {
          email: email,
        },
      });
      console.log("이메일 중복 체크 성공~!사용가능한 이메일입니다\n", res);
      return res;
    } catch (error) {
      console.log("이메일 중복 체크 실패~!\n", error.response.data.message);
      return error;
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
      setServerAuthCode(authCode);
    } catch (e) {
      console.log(e);
    }
  };

  const checkAuthCode = (userAuthCode) => {
    // 인증번호 체크
    if (userAuthCode === serverAuthCode) {
      console.log("유저,서버 인증코드 일치 성공~!");
      setDisplaySignupBtn(true);
      return;
    }
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try{
  //         // 이름 이메일 비밀번호 바디에 넣어서 회원가입 해주기
  //     }
  //   }
  return (
    <div className="flex flex-col items-center w-[1920px] h-[1080px] pb-[156px]">
      <Navbar />
      {/* {sidebarOpen && (
        <S.SidebarOverlay>
          <Sidebar />
          <S.OutSidebar onClick={handleSidebarOpen} />
        </S.SidebarOverlay>
      )} // 메인화면에서 빼 온 부분 */}
      <div className="flex w-[1280px] h-[860px] py-12 flex-col justify-start items-center gap-12">
        <div className="flex w-[700.92px] h-[760px] relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-300 py-[105px] px-24">
          <div className="w-10 h-10 absolute rounded-2xl left-[610px] top-[51px] cursor-pointer">
            <CloseOn />
          </div>
          <div className="w-full h-full flex flex-col justify-start items-center gap-7">
            <div className="w-full h-full flex flex-col justify-start items-center gap-14">
              {/* loginContentContainer */}
              <div className="flex justify-start text-gray-900 text-3xl font-bold font-['Pretendard'] leading-loose">
                회원가입
              </div>
              <form
                action=""
                onSubmit={handleSubmitAuthCode}
                className="w-full h-full flex flex-col justify-start items-start gap-9"
              >
                <div className="">인풋을 감싸는 넓이 높이 지정 div</div>
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
                />
                <Input
                  type={"password"}
                  placeholder={"비밀번호를 입력해주세요."}
                  title={"비밀번호"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type={"password"}
                  placeholder={"비밀번호를 다시 입력해주세요."}
                  title={"비밀번호 확인"}
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
                {serverAuthCode && (
                  <Input
                    type={"text"}
                    placeholder={"인증번호를 입력해주세요."}
                    title={"인증번호"}
                    value={userAuthCode}
                    onChange={(e) => setUserAuthCode(e.target.value)}
                    onBlur={() => checkAuthCode(userAuthCode)}
                  />
                )}
                {!displaySignupBtn && (
                  <button
                    type="submit"
                    id="btnSubmitAuth"
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
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
