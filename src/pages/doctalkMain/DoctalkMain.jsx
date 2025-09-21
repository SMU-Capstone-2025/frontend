import React, { useEffect, useState } from "react";
import ScheduleListPreview from "../../components/ScheduleListPreview/ScheduleListPreview";
import ProjectListPreview from "../../components/ProjectListPreview/ProjectListPreview";
import Layout from "../../components/NavbarLayout/Layout";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import { useNavigate } from "react-router-dom";

const DoctalkMain = () => {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // 유저 정보 가져오기
  const getUserIdInfo = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/mypage/user", {
        params: {
          Authorization: localStorage.getItem("accesToken"),
        },
      });
      setUserInfo(res.data.result);
      localStorage.setItem("userName", res.data.result?.name);
      localStorage.setItem("email", res.data.result?.email);
    } catch (error) {
      console.log("유저 정보 가져오기 실패:", error);
    }
  };

  // 프로젝트 리스트 가져오기
  const fetchProjects = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/project/list");
      setProjects(res.data.result || []);
      if (res.data.result?.length > 0) {
        setSelectedProjectId(res.data.result[0].projectId);
      }
    } catch (error) {
      console.log("프로젝트 리스트 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    getUserIdInfo();
    fetchProjects();
  }, []);

  return (
    <Layout onProjectCreated={fetchProjects}>
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-12 pt-16 px-4 z-10">
        <p className="text-gray-800 text-center font-['Palanquin'] text-xl sm:text-2xl font-bold leading-[32px] sm:leading-[42px] tracking-[-0.8px] sm:tracking-[-1.2px]">
          {localStorage.getItem("userName")}님, 오늘도 힘차게 시작해볼까요!
        </p>

        {/* 2컬럼 → 모바일에서는 1컬럼 */}
        <div className="flex flex-col items-start justify-center w-full gap-4 lg:flex-row">
          {/* 예정된 이벤트 */}
          <div className="flex flex-col items-start gap-3 w-full lg:w-[628px]">
            <p className="text-gray-400 font-['Livvic'] text-sm font-semibold leading-[19.6px] tracking-[-0.14px]">
              예정된 이벤트
            </p>
            <div className="flex flex-col items-start justify-center w-full gap-8 px-4 pb-6 bg-white border border-gray-200 rounded-lg sm:px-5 sm:pb-8">
              <ScheduleListPreview projectId={selectedProjectId} />
            </div>
          </div>

          {/* 나의 프로젝트 */}
          <div className="flex flex-col items-start gap-3 w-full lg:w-[628px]">
            <p className="text-gray-400 font-['Livvic'] text-sm font-semibold leading-[19.6px] tracking-[-0.14px]">
              나의 프로젝트
            </p>
            <div className="flex flex-wrap items-start w-full gap-4 sm:gap-6">
              <ProjectListPreview
                projects={projects}
                onCardClick={(projectId) => {
                  setSelectedProjectId(projectId);
                  navigate(`/project/workboard/${projectId}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctalkMain;
