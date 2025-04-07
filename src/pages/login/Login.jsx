import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Button from "../../components/Button/Button";

const Login = () => {
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
          <div className="w-10 h-10 absolute rounded-2xl left-[610px] top-[51px]">
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
                          placeholder="이름 혹은 이메일"
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
                          placeholder="8자리 이상"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-4">
                      로그인 정보기억하기 / 비밀번호를 잊어버리셨나요?
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start gap-11">
                    {/* 소셜로그인 버튼과 로그인버튼 감싸는 박스*/}
                    구글 카톡 깃허브
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
