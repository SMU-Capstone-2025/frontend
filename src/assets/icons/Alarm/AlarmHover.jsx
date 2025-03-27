import React from "react";

const AlarmHover = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect width="24" height="24" rx="2" fill="#F3F4F6" />
      <path
        d="M21 13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13C3 8.02944 7.02944 4 12 4C16.9706 4 21 8.02944 21 13Z"
        stroke="#1F2937"
        stroke-width="2"
      />
      <path
        d="M12 8V13L15 16"
        stroke="#1F2937"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M19 2L22 5"
        stroke="#1F2937"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M2 5L5 2"
        stroke="#1F2937"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default AlarmHover;
