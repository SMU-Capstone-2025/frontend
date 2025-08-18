import React from "react";
import PersonOn from "../../assets/icons/Person/PersonOn";

const ScheduleCard = ({ schedule, onClick }) => {
  // 버전 히스토리의 가장 최근 요소
  const lastContent =
    schedule.versionHistory?.[schedule.versionHistory.length - 1]?.content ||
    "";

  // 멤버 수 계산 (editors 기준)
  const editorCount = Array.isArray(schedule?.editors)
    ? schedule.editors.length
    : 0;
  const extra = Math.max(0, editorCount - 2); // 3명 이상이면 +N

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
      <div className="flex justify-end h-6 items-center relative">
        {editorCount >= 1 && (
          <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[#D5E8FC] absolute right-[20px]">
            <PersonOn color="#5BA7F7" />
          </div>
        )}
        {editorCount >= 2 && (
          <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[#FEF9C3] absolute right-[10px]">
            <PersonOn color="#FACC15" />
          </div>
        )}
        {extra > 0 && (
          <div className="flex w-6 h-6 items-center justify-center rounded-full border border-white bg-black/50 absolute right-0">
            <p className="text-white text-[10px] font-bold leading-[1.4]">
              +{extra}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard;
