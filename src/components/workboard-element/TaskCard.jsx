import React from "react";
import ProfileBlue from "../../assets/icons/Profile/ProfileBlue";
import ProfileYellow from "../../assets/icons/Profile/ProfileYellow";
import ProfilePlus from "../../assets/icons/Profile/ProfilePlus";

const TaskCard = ({ title, content, date, editors, onClick, onDelete }) => {
  return (
    <div
      className="flex p-4 flex-col items-start gap-[10px] w-full rounded-[10px] border border-[var(--gray-200,#E5E7EB)] bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-start gap-[10px] w-full">
        {/* 제목 */}
        <p
          title={title}
          className="text-[var(--gray-800,#1F2937)] text-base font-semibold leading-[140%] tracking-[-0.32px] font-pretendard break-words overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
        >
          {title}
        </p>

        {/* 설명 - 3줄, 줄바꿈 허용 */}

        <p
          title={content}
          className="text-[var(--gray-500,#6D7280)] text-xs font-normal leading-[140%] font-pretendard break-words line-clamp-3 overflow-hidden"
        >
          {content}
        </p>

        <div className="flex items-center justify-between w-full">
          {/* 날짜 - 길면 자동으로 생략 */}

          <p
            title={date}
            className="text-[#787878] text-xs font-normal leading-[140%] font-pretendard truncate max-w-[200px]"
          >
            {date}
          </p>

          {/* 에디터 표시 (최대 2명 + 초과 표시) */}
          <div className="flex items-center -space-x-[10px]">
            {editors.slice(0, 2).map((editor, idx) => (
              <div
                key={idx}
                title={editor}
                className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold"
              >
                {editor[0].toUpperCase()}
              </div>
            ))}
            {editors.length > 2 && <ProfilePlus />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
