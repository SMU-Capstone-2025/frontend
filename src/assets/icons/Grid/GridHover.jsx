import React from "react";

const GridHover = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect width="24" height="24" rx="2" fill="#F3F4F6" />
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        stroke="#1F2937"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        stroke="#1F2937"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        stroke="#1F2937"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        stroke="#1F2937"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default GridHover;
