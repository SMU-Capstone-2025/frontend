import React from "react";

const PlusOn = ({ color = "white" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M20 12H4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 4V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default PlusOn;
