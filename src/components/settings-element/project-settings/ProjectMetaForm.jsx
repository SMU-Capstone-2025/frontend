import React from "react";

const ProjectMetaForm = ({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  onSave,
}) => {
  return (
    <div className="flex flex-col items-start gap-[30px] p-5 sm:p-[35px_20px] w-full font-[Livvic] border-t border-gray-200">
      {/* 프로젝트 이름 */}
      <div className="flex flex-col items-start gap-1.5 w-full">
        <span className="text-xs font-bold text-gray-800 leading-[140%]">
          프로젝트 이름
        </span>
        <div className="flex items-start gap-1.5 w-full">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 border border-white rounded-full">
            <span className="text-blue-500 text-[28px] font-semibold leading-[130%] tracking-[-0.56px] font-pretendard">
              P
            </span>
          </div>
          <input
            type="text"
            placeholder="프로젝트 이름 입력"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="flex-1 h-10 px-3 text-[16px] text-gray-800 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* 프로젝트 설명 */}
      <div className="flex flex-col items-start gap-1.5 w-full">
        <span className="text-xs font-bold text-gray-800 leading-[140%]">
          프로젝트 설명
        </span>
        <input
          type="text"
          placeholder="프로젝트 설명 입력"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="w-full h-10 px-3 text-[16px] gray-800 border border-gray-200 rounded text- focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end w-full">
        <button
          onClick={onSave}
          className="bg-[#3191f2] hover:bg-[#0056b3] text-white font-medium rounded px-4 py-2 transition-colors"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default ProjectMetaForm;
