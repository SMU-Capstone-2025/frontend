import React from "react";
import ArrowLeftOn from "../../../../assets/icons/ArrowLeft/ArrowLeftOn";
import StarOn from "../../../../assets/icons/Star/StarOn";
import EllypsisVerticalOn from "../../../../assets/icons/EllypsisVertical/EllypsisVerticalOn";
import ProfileBlue from "../../../../assets/icons/Profile/ProfileBlue";
import ProfileYellow from "../../../../assets/icons/Profile/ProfileYellow";
import ProfilePlus from "../../../../assets/icons/Profile/ProfilePlus";
import VectorOn from "../../../../assets/icons/Vector/VectorOn";
import EditorToolbar from "../EditorToolbar";

const EditNavbar = ({ title, onTitleChange, onBack, editor }) => {
  return (
    <div className="w-[1920px] h-[151px] shrink-0 border-b border-gray-200 bg-white flex flex-col justify-center gap-y-4">
      {/* 상단 좌우 섹션 */}
      <div className="flex items-center justify-between px-7">
        {/* 왼쪽: 뒤로가기 + 제목 + 즐겨찾기 */}
        <div className="inline-flex items-center justify-center gap-[20px]">
          <div
            onClick={onBack}
            className="cursor-pointer flex items-center justify-center hover:opacity-30 transition"
          >
            <ArrowLeftOn />
          </div>
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="새 문서 작성"
            title={title}
            className="text-[24px] max-w-[200px] p-2 w-full font-bold leading-[120%] tracking-[-0.06em] text-gray-800 font-pretendard bg-transparent "
          />
          <StarOn />
        </div>

        {/* 오른쪽: 프로필 + 공유 버튼 + 옵션 */}
        <div className="flex items-center gap-[20px]">
          <div className="flex h-10 items-center gap-[6px] -space-x-[16.667px]">
            <ProfileBlue />
            <ProfileYellow />
            <ProfilePlus />
          </div>
          <button
            className="text-white text-center text-sm font-semibold leading-[140%] tracking-[-0.14px] flex h-10 px-4 py-2 justify-center items-center gap-[10px] rounded bg-[#3191f2] hover:opacity-30 transition"
            onClick={() => {
              console.log("Click 공유하기!");
            }}
          >
            공유하기
          </button>
          <div
            className="flex h-6 w-6 justify-center items-center cursor-pointer"
            onClick={() => {
              console.log("Click 더보기");
            }}
          >
            <EllypsisVerticalOn />
          </div>
        </div>
      </div>

      {/* 에디터 툴바 */}
      <div className="flex items-center justify-between px-7">
        <div className="inline-flex px-[35px] py-[10px] justify-center items-center rounded-[200px] bg-gray-100">
          <EditorToolbar editor={editor} />
        </div>
        <div
          className="flex w-6 h-6 items-center justify-center p-[3px] opacity-30 cursor-pointer hover:opacity-100 transition"
          onClick={() => {
            console.log("Click history!");
          }}
        >
          <VectorOn />
        </div>
      </div>
    </div>
  );
};

export default EditNavbar;
