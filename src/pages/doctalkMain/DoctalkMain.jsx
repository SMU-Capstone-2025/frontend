import React, { useEffect, useState } from "react";
import ScheduleListPreview from "../../components/ScheduleListPreview/ScheduleListPreview";
import ProjectListPreview from "../../components/ProjectListPreview/ProjectListPreview";
import Layout from "../../components/NavbarLayout/Layout";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const DoctalkMain = () => {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const getUserIdInfo = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/mypage/user", {
        params: {
          Authorization: localStorage.getItem("accesToken"), // Assuming userId is stored in localStorage
        },
      });
      console.log("유저 정보 가져오기 성공~!dd", res.data.result);
      setUserInfo(res.data.result);
      localStorage.setItem("userName", res.data.result?.name);
      localStorage.setItem("email", res.data.result?.email);

      return res;
    } catch (error) {
      console.log("유저 정보 가져오기 실패~!\n", error);
      return error;
    }
  };
  useEffect(() => {
    getUserIdInfo();
    // 초기 프로젝트 ID 설정
    const initialProjectId = "default-project-id"; // 실제로는 API 호출 등을 통해 가져와야 함
    console.log("초기 프로젝트 ID 설정:", selectedProjectId);
  }, [selectedProjectId]);
  return (
    <Layout>
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-12 pt-16 px-4 z-10">
        <p className="text-gray-800 text-center font-['Palanquin'] text-2xl font-bold leading-[42px] tracking-[-1.2px]">
          {localStorage.getItem("userName")}님, 오늘도 힘차게 시작해볼까요!
        </p>
        <div className="flex justify-center items-start w-full gap-2">
          <div className="flex flex-col items-start gap-3 w-[628px]">
            <p className="text-gray-400 font-['Livvic'] text-sm font-semibold leading-[19.6px] tracking-[-0.14px]">
              예정된 이벤트
            </p>
            <div className="flex flex-col justify-center items-start gap-14 w-full px-5 pb-8 rounded-lg border border-gray-200 bg-white">
              <ScheduleListPreview projectId={selectedProjectId} />
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 w-[628px]">
            <p className="text-gray-400 font-['Livvic'] text-sm font-semibold leading-[19.6px] tracking-[-0.14px]">
              나의 프로젝트
            </p>
            <div className="flex flex-wrap items-start gap-6 w-full">
              <ProjectListPreview onFirstProjectId={setSelectedProjectId} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctalkMain;
