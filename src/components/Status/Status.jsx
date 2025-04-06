import React from "react";

const Status = ({ name, backgroundColor, fontColor }) => {
  return (
    <div
      className="flex h-6 px-3 py-2 justify-center items-center gap-[10px] rounded-[6px]"
      style={{
        backgroundColor: backgroundColor,
        color: fontColor,
      }}
    >
      <span className="text-xs font-bold leading-[140%] font-pretendard">
        {name}
      </span>
    </div>
  );
};

export default Status;
