import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const Signup = () => {
  const { name, setName } = useState("");
  const { email, setEmail } = useState("");
  const { password, setPassword } = useState("");
  const { passwordCheck, setPasswordCheck } = useState("");

  const getEmailAvailCheck = async (email) => {
    try {
      const res = await axiosInstanceNoHeader.get("/register/avail-check", {
        params: {
          email: email,
        },
      });
      console.log("이메일 중복 체크 성공~!\n", res);
      return res;
    } catch (error) {
      console.log("이메일 중복 체크 실패~!\n", error);
      return error;
    }
  };

  const handleSetName = (e) => setName(e.target.value);
  const handleSetEmail = (e) => setEmail(e.target.value);
  const handleSetPassword = (e) => setPassword(e.target.value);
  const handleSetPasswordCheck = (e) => setPasswordCheck(e.target.value);

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
        <div className="flex w-[700.92px] h-[760px] relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden py-[105px] px-24">
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
                className="w-full h-full flex flex-col justify-start items-start gap-9"
              >
                <div className="">인풋을 감싸는 넓이 높이 지정 div</div>
                <Input
                  type={"text"}
                  placeholder={"성함을 입력해주세요."}
                  title={"이름"}
                  value={name}
                  onchange={(e) => setName(e.target.value)}
                />
                <Input
                  type={"email"}
                  placeholder={"이메일을 입력해주세요."}
                  title={"아이디"}
                  value={email}
                  onchange={(e) => setEmail(e.target.value)}
                  onBlur={() => getEmailAvailCheck(email)}
                />
                <Input
                  type={"password"}
                  placeholder={"비밀번호를 입력해주세요."}
                  title={"비밀번호"}
                  value={password}
                  onchange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type={"password"}
                  placeholder={"비밀번호를 다시 입력해주세요."}
                  title={"비밀번호 확인"}
                  value={passwordCheck}
                  onchange={(e) => setPasswordCheck(e.target.value)}
                />
                <button type="submit" className="w-full h-full cursor-pointer">
                  <Button
                    width={"100%"}
                    height={"100%"}
                    text={"인증번호 전송"}
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
