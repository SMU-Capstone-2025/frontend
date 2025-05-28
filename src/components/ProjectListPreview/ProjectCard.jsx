import React from "react";
import PersonOn from "../../assets/icons/Person/PersonOn";

const ProjectCard = ({ key, project }) => {
  const cardThemeColor = key % 4 === 0 || key % 4 === 3 ? "blue" : "yellow";

  // 색상 변수
  const coverBg = cardThemeColor === "blue" ? "bg-[#5ba7f7]" : "bg-[#FDE047]";
  const headerIconBg =
    cardThemeColor === "blue"
      ? "bg-[#D5E8FC] text-[#3191F2]"
      : "bg-[#FEF9C3] text-[#EAB308]";
  const contributorsBg = ["bg-[#D5E8FC]", "bg-[#FEF9C3]", "bg-[lightgray]"];
  const contributorsText = ["", "", "text-white"];

  return (
    <div className="w-[302px] h-[219px] rounded-[12px] border border-gray-200 bg-white relative z-[1]">
      <div
        className={`w-[302px] h-[59px] flex-shrink-0 rounded-t-[12px] ${coverBg} z-[2]`}
      />
      <div className="flex flex-col w-[262px] items-start gap-[14px] absolute left-5 top-[30px] z-10">
        <div
          className={`flex w-[56px] h-[56px] justify-center items-center rounded-full border border-white ${headerIconBg} text-center font-['Pretendard'] text-[28px] font-semibold leading-[1.3] tracking-[-0.56px]`}
        >
          {project.name[0].toUpperCase()}
        </div>
        <div className="flex flex-col items-start gap-[6px] self-stretch">
          <p className="text-[#1f2937] font-['Pretendard'] text-lg font-semibold leading-[1.4] tracking-[-0.36px]">
            {project.name}
          </p>
          <p className="overflow-hidden text-ellipsis text-[#6d7280] font-['Pretendard'] text-xs font-normal leading-[1.4] line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="flex justify-start h-6 items-center relative">
          <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[#D5E8FC] absolute left-0">
            <PersonOn color={"#5BA7F7"} />
          </div>
          <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[#FEF9C3] absolute left-[10px]">
            <PersonOn color={"#FACC15"} />
          </div>
          <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[lightgray] absolute left-[20px]">
            <p className="w-full h-full text-white text-center font-['Pretendard'] text-[10px] font-bold leading-[1.4]">
              +1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
