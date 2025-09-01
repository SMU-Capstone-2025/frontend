import React from "react";
import ArrowLeftOn from "../../../../assets/icons/ArrowLeft/ArrowLeftOn";
import EllypsisVerticalOn from "../../../../assets/icons/EllypsisVertical/EllypsisVerticalOn";
import PersonOn from "../../../../assets/icons/Person/PersonOn";
import VectorOn from "../../../../assets/icons/Vector/VectorOn";
import EditorToolbar from "../EditorToolbar";

const EditNavbar = ({
  title,
  onTitleChange,
  onBack,
  editor,
  onSummaryClick,
  onCorrectClick,
  editors = [],
}) => {
  return (
    <div className="w-full h-[151px] shrink-0 border-b border-[#e5e7eb] bg-[#fff] flex flex-col justify-center gap-y-4 font-[Palaquin]">
      {/* 상단 좌우 섹션 */}
      <div className="flex items-center justify-between px-7">
        {/* 왼쪽: 뒤로가기 + 제목 */}
        <div className="inline-flex items-center justify-center gap-[20px]">
          <div
            onClick={onBack}
            className="flex items-center justify-center transition cursor-pointer hover:opacity-30"
          >
            <ArrowLeftOn />
          </div>
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="새 문서 작성"
            title={title}
            className="text-[24px] p-2 max-w-[1000px] w-full font-bold leading-[120%] tracking-[-0.06em] text-gray-800 bg-transparent"
          />
        </div>

        {/* 오른쪽: 프로필 + 공유 버튼 + 옵션 */}
        <div className="flex items-center gap-[30px]">
          <div className="flex h-10 items-center gap-[6px] -space-x-[16.667px]">
            {editors.slice(0, 2).map((email, i) => (
              <div
                key={i}
                className={`flex w-10 h-10 items-center justify-center rounded-full border-[1.5px] border-white
                  ${i % 2 === 0 ? "bg-blue-100" : "bg-yellow-100"}`}
                title={email}
              >
                <PersonOn
                  color={i % 2 === 0 ? "#5BA7F7" : "#FACC15"} // Blue / Yellow 아이콘 색
                  size={22}
                />
              </div>
            ))}
            {editors.length > 2 && (
              <div
                className="flex w-10 h-10 items-center justify-center rounded-full border-none bg-black/50 text-white text-[15px] font-semibold"
                title={`외 ${editors.length - 2}명`}
              >
                +{editors.length - 2}
              </div>
            )}
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
            className="flex items-center justify-center w-6 h-6 cursor-pointer"
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
        <div className="inline-flex px-[35px] py-[10px] justify-center items-center rounded-[200px] bg-[#F3F4F6]">
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
