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
import { Menu } from "lucide-react";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [UserIdCardOpen, setUserIdCardOpen] = useState(false);
  const { notifications, setNotifications } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const userEmail = localStorage.getItem("email");
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = accessToken && accessToken !== "undefined"; // 로그인 여부 체크

  const handleStartMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 9);
    navigate(`/video-call?call=${roomId}`);
  };

  // 알림 소켓 구독
  useNotificationSocket({
    userEmail,
    onMessage: (message) => {
      setNotifications((prev) => [message, ...prev]); // 최근 알림 위에 추가
    },
  });

  const handleSidebarOpen = () => setSidebarOpen(!sidebarOpen);
  const handleUserIdCardOpen = () => setUserIdCardOpen(!UserIdCardOpen);
  const goToHome = () => navigate("/");

  const logout = async () => {
    try {
      await axiosInstanceNoHeader.post("/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userName");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };
  const handleLogout = () => logout();

  return (
    <div className="fixed top-0 left-0 w-full h-16 sm:h-16 flex justify-between items-center border-b border-gray-200 bg-[#f9fafb] px-3 sm:px-5 z-50">
      {/* 왼쪽 */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* 로그인된 사용자만 사이드바 버튼 표시 */}
        {isLoggedIn && (
          <div
            className="w-6 h-6 cursor-pointer sm:w-6 sm:h-6"
            onClick={handleSidebarOpen}
          >
            <SidebarOn />
          </div>
        )}

        {/* 로그인된 사용자만 홈 버튼 표시 */}
        {isLoggedIn && (
          <div
            className="hidden w-6 h-6 cursor-pointer sm:block"
            onClick={goToHome}
          >
            <HomeOn />
          </div>
        )}
      </div>

      {/* 로고 */}
      <div
        className="absolute flex items-center justify-center h-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer top-1/2 left-1/2"
        onClick={goToHome}
      >
        <Logo className="w-16 sm:w-20 md:w-24" />
      </div>

      {/* 오른쪽 */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* 로그인된 사용자만 프로필 표시 */}
        {isLoggedIn && (
          <div
            className="relative flex items-center w-10 h-10 p-2 bg-blue-100 border border-white rounded-full cursor-pointer"
            onClick={handleUserIdCardOpen}
          >
            <PersonOn color={"#5BA7F7"} />
            {UserIdCardOpen && (
              <div className="absolute right-0 cursor-auto top-12">
                <UserIdCard />
              </div>
            )}
          </div>
        )}

        {/* 모바일 메뉴 버튼 (로그인 여부와 무관하게 항상 표시) */}
        <div
          className="w-6 h-6 cursor-pointer sm:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu />
        </div>

        {/* 데스크탑 메뉴 */}
        <div className="items-center hidden gap-5 sm:flex sm:gap-5">
          {/* 로그인된 사용자만 알림 버튼 표시 */}
          {isLoggedIn && (
            <div
              className="relative w-6 h-6 cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <BellOn />
              {notifications.length > 0 && (
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {notifications.length}
                </span>
              )}

              {/* 알림 드롭다운 */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-[320px] sm:w-[400px] bg-white shadow-md rounded-xl border border-gray-100 z-50">
                  {/* 헤더 */}
                  <div className="px-4 py-2 font-semibold text-gray-800 border-b">
                    알림
                  </div>
                  {/* 알림 리스트 */}
                  <ul className="flex flex-col gap-3 p-3 overflow-y-auto max-h-80">
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            if (n.redirectionUrl) {
                              const url = new URL(n.redirectionUrl);
                              navigate(url.pathname);
                            }
                          }}
                          className="p-3 transition bg-white border rounded-lg cursor-pointer border-gray-150 hover:bg-sky-50"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                              {n.message}
                            </span>
                            <span className="text-xs text-gray-400">
                              {n.receivedAt &&
                                new Date(n.receivedAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                            </span>
                          </div>
                          {n.title && (
                            <div className="mt-1 text-xs text-gray-600">
                              제목: {n.title}
                            </div>
                          )}
                          {n.editor && (
                            <div className="text-xs text-gray-500">
                              편집자: {n.editor}
                            </div>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-10 text-sm text-center text-gray-400">
                        새 알림이 없습니다.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 로그인 / 로그아웃 / 화상회의 */}
          {!isLoggedIn ? (
            <Button
              type="button"
              width="auto"
              height="fit-content"
              text="Sign Up"
              onClick={() => navigate("/signup")}
            />
          ) : (
            <>
              <Button
                width="fit-content"
                height="40px"
                text="로그아웃"
                onClick={handleLogout}
              />
              <Button
                width="fit-content"
                height="40px"
                text="화상 회의"
                onClick={handleStartMeeting}
              />
            </>
          )}
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {showMobileMenu && (
        <div className="absolute top-14 right-3 w-[200px] bg-white border rounded-lg shadow-lg z-50 p-3 flex flex-col gap-3">
          {!isLoggedIn ? (
            <Button
              type="button"
              text="Sign Up"
              onClick={() => navigate("/signup")}
            />
          ) : (
            <>
              <Button text="로그아웃" onClick={handleLogout} />
              <Button text="화상 회의" onClick={handleStartMeeting} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
