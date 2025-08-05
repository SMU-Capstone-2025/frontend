import React, { useState } from "react";
import Logo from "../../assets/icons/Logo/Logo";
import SidebarOn from "../../assets/icons/Sidebar/SidebarOn";
import HomeOn from "../../assets/icons/Home/HomeOn";
import BellOn from "../../assets/icons/Bell/BellOn";
import Button from "../Button/Button";
import PersonOn from "../../assets/icons/Person/PersonOn";
import UserIdCard from "../UserIdCard/UserIdCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const handleSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("sidebarOpen", sidebarOpen);
  };

  const [UserIdCardOpen, setUserIdCardOpen] = useState(false);

  const handleUserIdCardOpen = () => {
    setUserIdCardOpen(!UserIdCardOpen);
    console.log("UserIdCardOpen", UserIdCardOpen);
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  const logout = async () => {
    try {
      // await axiosInstanceNoHeader.post("/logout", {});
      console.log("로그아웃 성공");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userName");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };
  const handleLogout = () => {
    console.log("로그아웃 버튼 클릭");
    logout();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-16 flex justify-between items-center border-b border-gray-200 bg-[#f9fafb] px-5 z-50">
      <div className="flex items-center gap-5">
        <div className="w-6 h-6 cursor-pointer" onClick={handleSidebarOpen}>
          <SidebarOn />
        </div>
        <div className="w-6 h-6 cursor-pointer" onClick={goToHome}>
          <HomeOn />
        </div>
      </div>
      <div
        className="flex h-16 px-2.5 justify-center items-center gap-2.5 cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        onClick={goToHome}
      >
        <Logo />
      </div>
      <div className="flex justify-end items-center gap-5">
        {sidebarOpen ? null : (
          <>
            <div className="w-6 h-6 cursor-pointer">
              <BellOn />
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer relative">
              <div
                className="flex w-10 h-10 p-1.5 items-center gap-4 rounded-full border border-white bg-blue-100"
                onClick={handleUserIdCardOpen}
              >
                <PersonOn color={"#5BA7F7"} />
                {UserIdCardOpen && (
                  <div className="absolute bottom-[-140px] right-[10px]">
                    <UserIdCard />
                  </div>
                )}
              </div>
              {/* <p className="flex w-fit h-7 items-center">독톡 님</p> */}
            </div>
          </>
        )}
        <Button
          width={"fit-content"}
          height={"40px"}
          text={"로그아웃"}
          onClick={handleLogout}
        />
        <Button width={"fit-content"} height={"40px"} text={"화상 회의 시작"} />
      </div>
    </div>
  );
};

export default Navbar;
