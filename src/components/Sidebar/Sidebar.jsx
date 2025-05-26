import React, { useEffect, useState } from "react";
import PlusOff from "../../assets/icons/Plus/PlusOff";
import ArrowRightOff from "../../assets/icons/ArrowRight/ArrowRightOff";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const Sidebar = () => {
  const [newProjectCreateModalOpen, setNewProjectCreateModalOpen] =
    useState(false);
  const handleNewProjectCreateModalOpen = () => {
    setNewProjectCreateModalOpen(!newProjectCreateModalOpen);
    console.log("프로젝트생성모달", newProjectCreateModalOpen);
  };
  const [userProjectListInfo, setUserProjectListInfo] = useState(null);

  const getUserProjectListInfo = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/project/list");
      console.log("프로젝트 리스트 가져오기 성공~!", res);
      setUserProjectListInfo(res.data.result);
      return res;
    } catch (error) {
      console.log("프로젝트 리스트 가져오기 실패~!\n", error);
      return error;
    }
  };
  useEffect(() => {
    getUserProjectListInfo();
  }, []);
  console.log("프로젝트 리스트:", userProjectListInfo);

  return (
    <div className="flex flex-col w-[240px] h-[1016px] p-5 justify-between items-start gap-y-[22px] gap-x-[12px] flex-shrink-0 flex-wrap bg-white z-[50]">
      <div className="flex flex-col justify-start w-[200px] h-[222px] gap-y-[22px]">
        <div className="flex justify-between items-start gap-x-[12px]">
          <p className="w-[164px] h-fit text-gray-400 font-['Pretendard'] text-base font-semibold leading-[1.4] tracking-[-0.32px]">
            Projects
          </p>
          <div
            className="hover:cursor-pointer"
            onClick={handleNewProjectCreateModalOpen}
          >
            <PlusOff />
            {/* //onClick={handleNewProjectCreateModalOpen}을 PlusOff에 하면 작동하지않음 */}
          </div>
        </div>
        <div className="flex w-[200px] flex-col justify-center items-center gap-y-[14px] flex-shrink-0">
          {userProjectListInfo.map((proj, idx) => (
            <div
              key={idx}
              className="flex items-center gap-x-[12px] self-stretch"
            >
              <div className="flex w-6 h-6 justify-center items-center rounded-full border border-white bg-[#d5e8fc] text-[#3191f2] text-center font-['Pretendard'] text-xs font-semibold leading-[1.3] tracking-[-0.56px]">
                {proj.name[0].toUpperCase()}
              </div>
              <div className="flex flex-start  w-[164px] text-[#1f2937] font-['Pretendard'] text-sm font-semibold leading-[1.4] tracking-[-0.14px]"></div>
              {proj.name}
            </div>
          ))}
        </div>
      </div>
      <div className="inline-flex p-3 flex-col items-start gap-y-1 rounded-lg bg-gray-100">
        <div className="flex w-[176px] items-center gap-x-[2px]">
          <p className="text-gray-400 font-['Pretendard'] text-[10px] font-bold leading-[1.4]">
            요금제 정보
          </p>
          <ArrowRightOff />
        </div>
        <div className="self-stretch text-[#1f2937] font-['Pretendard'] text-xs font-bold leading-[1.4]">
          스탠다드 구독 중
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
