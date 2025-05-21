import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ScheduleListPreview from "../../components/ScheduleListPreview/ScheduleListPreview";
import ProjectListPreview from "../../components/ProjectListPreview/ProjectListPreview";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout from "../../components/NavbarLayout/Layout";

const DoctalkMain = () => {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-12 w-[1280px] pt-12 relative top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-15">
        <p className="text-gray-800 text-center font-pretendard text-2xl font-bold leading-[42px] tracking-[-1.2px]">
          독톡님, 오늘도 힘차게 시작해볼까요!
        </p>
        <div className="flex justify-center items-start w-full gap-2">
          <div className="flex flex-col items-start gap-3 w-[628px]">
            <p className="text-gray-400 font-pretendard text-sm font-semibold leading-[19.6px] tracking-[-0.14px]">
              예정된 이벤트
            </p>
            <div className="flex flex-col justify-center items-start gap-14 w-full p-5 rounded-lg border border-gray-200 bg-white">
              <ScheduleListPreview />
              <ScheduleListPreview />
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 w-[628px]">
            <p className="text-gray-400 font-pretendard text-sm font-semibold leading-[19.6px] tracking-[-0.14px]">
              나의 프로젝트
            </p>
            <div className="flex flex-wrap items-start gap-6 w-full">
              <ProjectListPreview />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctalkMain;
