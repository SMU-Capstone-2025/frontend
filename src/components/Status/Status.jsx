import React from "react";

// 영문 상태 -> 한글 상태로 매핑
const statusMap = {
  PENDING: "진행 전",
  PROGRESS: "진행 중",
  COMPLETED: "완료",
};

// 상태별 색상 매핑
const statusColors = {
  "진행 전": { backgroundColor: "#FEF08A", color: "#713f12" },
  "진행 중": { backgroundColor: "#FECACA", color: "#991B1B" },
  완료: { backgroundColor: "#D5E8FC", color: "#064488" },
  "기타 문서": { backgroundColor: "#E5E7EB", color: "#374151" },
};

const Status = ({ name }) => {
  const translatedStatus = statusMap[name] || "기타 문서";
  const { backgroundColor, color } = statusColors[translatedStatus];

  return (
    <div
      className="flex h-6 px-3 py-2 justify-center items-center gap-[10px] rounded-[6px]"
      style={{
        backgroundColor: backgroundColor,
        color: color,
      }}
    >
      <span className="text-xs font-bold leading-[140%] font-pretendard">
        {translatedStatus}
      </span>
    </div>
  );
};

export default Status;
