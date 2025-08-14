import React from "react";
import PersonOn from "../../assets/icons/Person/PersonOn";

const ProjectCard = ({ keyNum, project, onClick }) => {
  const cardThemeColor =
    keyNum % 4 === 0 || keyNum % 4 === 3 ? "blue" : "yellow";

  // 색상 변수
  const coverBg = cardThemeColor === "blue" ? "bg-[#5ba7f7]" : "bg-[#FDE047]";
  const headerIconBg =
    cardThemeColor === "blue"
      ? "bg-[#D5E8FC] text-[#3191F2]"
      : "bg-[#FEF9C3] text-[#EAB308]";

  // 멤버 수 계산
  const coworkerCount = Array.isArray(project?.coworkers)
    ? project.coworkers.length
    : 0;
  const extra = Math.max(0, coworkerCount - 2); // 3명 이상이면 +N

  return (
    <div
      className="w-[302px] h-[219px] rounded-[12px] border border-gray-200 bg-white relative z-[1]"
      onClick={onClick}
    >
      <div className={`w-[302px] h-[59px] rounded-t-[12px] ${coverBg} z-[2]`} />
      <div className="flex flex-col w-[262px] items-start gap-[14px] absolute left-5 top-[30px] z-10">
        <div
          className={`flex w-[56px] h-[56px] justify-center items-center rounded-full border border-white ${headerIconBg} text-center font-['Palanquin'] text-[28px] font-semibold leading-[1.3] tracking-[-0.56px]`}
        >
          {(project?.name || "?")[0].toUpperCase()}
        </div>

        <div className="flex flex-col items-start gap-[6px] self-stretch">
          <p
            className="w-full line-clamp-1 break-words text-[#1f2937] font-['Livvic'] text-lg font-semibold leading-[1.4] tracking-[-0.36px]"
            title={project?.name}
          >
            {project?.name}
          </p>
          <p
            className="w-full line-clamp-1 break-words text-[#6d7280] font-['Palanquin'] text-xs leading-[1.4]"
            title={project?.description || ""}
          >
            {project?.description}
          </p>
        </div>

        {/* 멤버 아이콘 */}
        <div className="flex justify-start h-6 items-center relative">
          {coworkerCount >= 1 && (
            <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[#D5E8FC] absolute left-0">
              <PersonOn color="#5BA7F7" />
            </div>
          )}
          {coworkerCount >= 2 && (
            <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[#FEF9C3] absolute left-[10px]">
              <PersonOn color="#FACC15" />
            </div>
          )}
          {extra > 0 && (
            <div className="flex w-6 h-6 items-center justify-center rounded-full border border-white bg-black/50 absolute left-[20px]">
              <p className="w-full h-full flex items-center justify-center text-white text-center font-['Palanquin'] text-[10px] font-bold leading-[1.4]">
                +{extra}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
