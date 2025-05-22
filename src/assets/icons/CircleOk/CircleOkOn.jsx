import React from "react";

const CircleOkOn = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 28 24"
      fill="none"
    >
      <path
        d="M7 13L10 16L17 9"
        stroke={color ? color : "#1F2937"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color ? color : "#1F2937"}
        strokeWidth="2"
      />
    </svg>
  );
};

export default CircleOkOn;
