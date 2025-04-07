import React from "react";

const SidebarHover = () => {
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
        x="21"
        y="3"
        width="18"
        height="18"
        rx="1"
        transform="rotate(90 21 3)"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3V21"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SidebarHover;
