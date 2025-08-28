import React, { useState } from "react";
import Logo from "../../assets/icons/Logo/Logo";
import SidebarOn from "../../assets/icons/Sidebar/SidebarOn";
import HomeOn from "../../assets/icons/Home/HomeOn";
import BellOn from "../../assets/icons/Bell/BellOn";
import Button from "../Button/Button";
import PersonOn from "../../assets/icons/Person/PersonOn";
import UserIdCard from "../UserIdCard/UserIdCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import useNotificationSocket from "../../hooks/useNotificationSocket";
import { useNotifications } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [UserIdCardOpen, setUserIdCardOpen] = useState(false);
  const { notifications, setNotifications } = useNotifications(); // 알림 저장
  const [showDropdown, setShowDropdown] = useState(false); // 알림 드롭다운 열림 여부

  const userEmail = localStorage.getItem("email");

  // 알림 소켓 구독
  useNotificationSocket({
    userEmail,
    onMessage: (message) => {
      console.log("새 알림:", message);
      setNotifications((prev) => [message, ...prev]); // 최근 알림 위에 추가
    },
  });

  const handleSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUserIdCardOpen = () => {
    setUserIdCardOpen(!UserIdCardOpen);
  };

  const goToHome = () => {
    navigate("/");
    // window.location.href 방식 쓰면 페이지 전체 리렌더링 돼서 전역관리하는 알림 사라짐 <- 주의
  };

  const logout = async () => {
    try {
      await axiosInstanceNoHeader.post("/logout");
      console.log("로그아웃 성공");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userName");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleLogout = () => {
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
      <div className="flex justify-end items-center gap-5 relative">
        {sidebarOpen ? null : (
          <>
            {/* 알림 아이콘 */}
            <div
              className="relative w-6 h-6 cursor-pointer font-[Palaquin]"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <BellOn />
              {/* 새 알림 개수 뱃지 */}
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-[10px] border border-gray-200 z-50">
                  <div className="py-3 px-6 font-semibold border-b">알림</div>
                  <ul className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <li
                          key={i}
                          className="px-4 py-3 text-sm flex flex-col gap-1 border-l-8 border-l-transparent cursor-pointer hover:border-l-blue-400"
                        >
                          {/* 메인 메시지 */}
                          <span className="font-medium text-gray-900">
                            {n.message}
                          </span>
                          {/* 문서 제목 */}
                          <span className="text-gray-600 text-xs">
                            제목: {n.title}
                          </span>
                          {/* 편집자 */}
                          <span className="text-gray-500 text-xs">
                            편집자: {n.editor}
                          </span>
                          {/* 수신 시간 */}
                          <span className="text-gray-400 text-xs">
                            {n.receivedAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-6 text-sm text-gray-400 text-center">
                        새 알림이 없습니다.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            {/* 사용자 아이콘 */}
            <div className="flex items-center gap-1.5 relative">
              <div
                className="flex w-10 h-10 p-1.5 items-center gap-4 rounded-full border border-white bg-blue-100 cursor-pointer"
                onClick={handleUserIdCardOpen}
              >
                <PersonOn color={"#5BA7F7"} />
                {UserIdCardOpen && (
                  <div className="absolute bottom-[-140px] right-[10px] cursor-auto">
                    <UserIdCard />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {/* 로그인이 되어 있을 때만 로그아웃 버튼 노출 */}
        {localStorage.getItem("accessToken") &&
        localStorage.getItem("accessToken") !== "undefined" ? (
          <Button
            width={"fit-content"}
            height={"40px"}
            text={"로그아웃"}
            onClick={handleLogout}
          />
        ) : null}
        <Button width={"fit-content"} height={"40px"} text={"화상 회의 시작"} />
      </div>
    </div>
  );
};

export default Navbar;
