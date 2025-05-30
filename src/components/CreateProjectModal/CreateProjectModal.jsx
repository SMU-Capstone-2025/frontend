import React from "react";
import CloseOn from "../../assets/icons/Close/CloseOn";

const CreateProjectModal = () => {
  return (
    <div className="flex w-full h-full justify-center items-center bg-black/50 z-99">
      <div className="w-[550px] h-[550px] flex flex-col justify-center relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
        <div className="w-10 h-10 absolute rounded-2xl right-[20px] top-[20px] cursor-pointer">
          <CloseOn />
        </div>
        <div className="w-full h-[550px] flex flex-col justify-start items-center gap-7">
          <div className="text-gray-900 text-xl font-bold font-['Pretendard']">
            프로젝트 생성
          </div>
          <form className="flex flex-col justify-start items-center gap-5">
            <input
              type="text"
              placeholder="프로젝트 이름"
              className="w-[400px] h-[50px] bg-gray-100 rounded-lg px-4 outline-none"
            />
            <input
              type="text"
              placeholder="프로젝트 설명"
              className="w-[400px] h-[50px] bg-gray-100 rounded-lg px-4 outline-none"
            />
            <button
              type="submit"
              className="w-[400px] h-[50px] bg-blue-500 rounded-lg text-white font-bold"
            >
              생성하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
