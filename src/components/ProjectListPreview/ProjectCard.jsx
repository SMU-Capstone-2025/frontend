import React from "react";
import PersonOn from "../../assets/icons/Person/PersonOn";

const ProjectCard = ({ keyNum, project, onClick }) => {
  const cardThemeColor =
    keyNum % 4 === 0 || keyNum % 4 === 3 ? "blue" : "yellow";

  const coverBg = cardThemeColor === "blue" ? "bg-[#5ba7f7]" : "bg-[#FDE047]";
  const headerIconBg =
    cardThemeColor === "blue"
      ? "bg-[#D5E8FC] text-[#3191F2]"
      : "bg-[#FEF9C3] text-[#EAB308]";

  const coworkerCount = Array.isArray(project?.coworkers)
    ? project.coworkers.length
    : 0;
  const extra = Math.max(0, coworkerCount - 2);

  return (
    <div
      className="cursor-pointer w-full aspect-[4/3] rounded-[12px] border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-lg flex flex-col"
      onClick={onClick}
    >
      {/* 헤더 커버 */}
      <div className={`relative w-full h-[26%] rounded-t-[12px] ${coverBg}`}>
        <div
          className={`absolute left-4 bottom-[-28px] flex w-[56px] h-[56px] justify-center items-center rounded-full border border-white ${headerIconBg} text-center font-['Palanquin'] text-[28px] font-semibold leading-[1.3]`}
        >
          {(project?.name || "?")[0].toUpperCase()}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col flex-1 gap-2 px-4 pt-10 pb-4">
        {/* 프로젝트명 */}
        <p
          className="w-full line-clamp-1 break-words text-[#1f2937] font-['Livvic'] text-lg font-semibold leading-[1.4]"
          title={project?.name}
        >
          {project?.name}
        </p>

        {/* 설명 */}
        <p
          className="w-full line-clamp-1 break-words text-[#6d7280] font-['Palanquin'] text-xs leading-[1.4]"
          title={project?.description || ""}
        >
          {project?.description}
        </p>

        {/* 멤버 아이콘 */}
        <div
          title={project?.coworkers?.map((c) => c.name).join(", ")}
          className="flex items-center h-6 mt-5"
        >
          {coworkerCount >= 1 && (
            <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[#D5E8FC]">
              <PersonOn color="#5BA7F7" />
            </div>
          )}
          {coworkerCount >= 2 && (
            <div className="flex w-6 h-6 p-1 items-center rounded-full border border-white bg-[#FEF9C3] -ml-2">
              <PersonOn color="#FACC15" />
            </div>
          )}
          {extra > 0 && (
            <div className="flex items-center justify-center w-6 h-6 -ml-2 border border-white rounded-full bg-black/50">
              <p className="text-white text-[10px] font-bold leading-[1.4]">
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
