import React from "react";

const ImageOn = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="21"
        y="3"
        width="18"
        height="18"
        transform="rotate(90 21 3)"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14L7 10L18 21"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5 10C14.8807 10 16 8.88071 16 7.5C16 6.11929 14.8807 5 13.5 5C12.1193 5 11 6.11929 11 7.5C11 8.88071 12.1193 10 13.5 10Z"
        stroke="#1F2937"
        strokeWidth="2"
      />
      <path d="M13.5 16.5L21 9" stroke="#1F2937" strokeWidth="2" />
    </svg>
  );
};

export default ImageOn;
