import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { DocumentIcon, SettingsIcon, WorkBoardIcon } from "../../assets/icons/";
import Navbar from "../../components/Navbar/Navbar";

const tabs = [
  { to: "/project/workboard", label: "작업 보드", icon: <WorkBoardIcon /> },
  { to: "/project/document", label: "문서", icon: <DocumentIcon /> },
  { to: "/project/settings", label: "설정", icon: <SettingsIcon /> },
]; // 탭 구조를 배열로 만들어 재사용성 높임

const Project = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="flex flex-col justify-end items-start gap-6 pt-6 w-full max-w-screen-xl border-none ">
        <div className="flex flex-wrap md:flex-nowrap items-start md:items-center gap-3 md:gap-6">
          {tabs.map(({ to, label, icon }) => (
            <NavLink
              key={label} // 배열 렌더링시 고유 ID 필요
              to={to} // 링크 클릭 시 이동할 URL 경로 지정
              className={({ isActive }) =>
                `flex items-center gap-1.5 py-2 text-sm sm:text-base md:text-[20px] font-semibold cursor-pointer text-black no-underline 
                ${isActive ? "opacity-100 border-b-2 md:border-b-4 border-black" : "opacity-30"}`
              }
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Project;
