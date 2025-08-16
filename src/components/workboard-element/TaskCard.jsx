import React from "react";
import ProfileBlue from "../../assets/icons/Profile/ProfileBlue";
import ProfileYellow from "../../assets/icons/Profile/ProfileYellow";
import ProfilePlus from "../../assets/icons/Profile/ProfilePlus";

const TaskCard = ({
  title,
  content,
  date,
  coworkers = [],
  onClick,
  onDelete,
}) => {
  const visibleCount = 2; // 앞에 보여줄 아이콘 개수
  const extraCount = Math.max(0, coworkers.length - visibleCount);

  return (
    <div
      className="flex p-4 flex-col items-start gap-[10px] w-full rounded-[10px] border border-[var(--gray-200,#E5E7EB)] bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-start gap-[10px] w-full">
        {/* 제목 */}
        <p
          title={title}
          className="text-[var(--gray-800,#1F2937)] text-base font-semibold leading-[140%] tracking-[-0.32px] font-[Livvic] break-words overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
        >
          {title}
        </p>

        {/* 설명 */}
        <p
          title={content}
          className="text-[var(--gray-500,#6D7280)] text-xs font-normal leading-[140%] break-words line-clamp-3 overflow-hidden font-[Palanquin]"
        >
          {content}
        </p>

        <div className="flex items-center justify-between w-full">
          {/* 날짜 */}
          <p
            title={date}
            className="text-[#787878] text-xs font-normal leading-[140%] truncate max-w-[200px] font-[Palanquin]"
          >
            {date}
          </p>

          {/* 에디터 표시 */}
          <div className="flex items-center -space-x-[10px]">
            {coworkers
              .slice(0, visibleCount)
              .map((_, idx) =>
                idx === 0 ? (
                  <ProfileBlue key={idx} />
                ) : (
                  <ProfileYellow key={idx} />
                )
              )}
            {extraCount > 0 && (
              <div
                className="font-[Palanquin] w-6 h-6 rounded-full font-[400] bg-black/50 text-white text-[10px] flex items-center justify-center leading-[140%]"
                title={`외 ${extraCount}명`}
              >
                +{extraCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
