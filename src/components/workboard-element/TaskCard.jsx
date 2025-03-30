import React from "react";

function TaskCard({ title, description, date }) {
  return (
    <div className="flex p-4 flex-col items-start gap-[10px] self-stretch rounded-[10px] border border-[var(--gray-200,#E5E7EB)] bg-white">
      <div className="flex w-[348px] h-[105px] flex-col items-start gap-[10px]">
        <p className="self-stretch text-[var(--gray-800,#1F2937)] text-base font-semibold leading-[140%] tracking-[-0.32px] font-pretendard">
          {title}
        </p>
        <p className="h-[41.05px] shrink-0 self-stretch overflow-hidden whitespace-nowrap text-ellipsis text-[var(--gray-500,#6D7280)] text-xs font-normal leading-[140%] font-pretendard">
          {description}
        </p>
        <div className="flex justify-between items-center self-stretch">
          <p className="w-[200px] text-[#787878] text-xs font-normal leading-[140%] font-pretendard overflow-hidden text-ellipsis line-clamp-1">
            {date}
          </p>
          <div className="flex w-[52px] h-[24px] items-center -space-x-[10px]"></div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
