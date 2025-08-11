import React from "react";
import PersonOn from "../../assets/icons/Person/PersonOn";

const ScheduleCard = ({ schedule, onClick }) => {
  // 버전 히스토리의 가장 최근 요소
  const lastContent =
    schedule.versionHistory?.[schedule.versionHistory.length - 1]?.content ||
    "";

  return (
    <div
      className="flex p-5 justify-between items-start self-stretch rounded-lg outline outline-1 outline-gray-200  bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-start w-[300px] gap-1">
        <div className="font-['Livvic'] text-black text-base font-semibold">
          {schedule.title}
        </div>
        <div className="font-['Palanquin'] text-gray-400 text-xs self-stretch">
          {lastContent}
        </div>
      </div>
      <div className="flex justify-end items-center h-6 relative">
        <div className="flex w-6 h-6 p-1 relative items-center rounded-full border border-white bg-[#D5E8FC] right-[-28px] ">
          <PersonOn color={"#5BA7F7"} />
        </div>
        <div className="flex w-6 h-6 p-1 relative items-center rounded-full border border-white bg-[#FEF9C3] right-[-14px] ">
          <PersonOn color={"#FACC15"} />
        </div>
        <div className="flex w-6 h-6 p-1 relative items-center rounded-full border border-white bg-[lightgray] right-0 ">
          <div className="w-full h-full text-white text-center font-['Palanquin'] text-[10px] font-bold leading-[1.4]">
            {/* {schedule.coworkers.length - 2} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
