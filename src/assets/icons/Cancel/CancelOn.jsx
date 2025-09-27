import React from "react";

const CancelOn = ({ color }) => {
  return (
    <div>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.5355 20.5355L13.4645 13.4644"
          stroke={color ? color : "#1F2937"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13.4645 20.5355L20.5355 13.4644"
          stroke={color ? color : "#1F2937"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.92893 24.071C13.8342 27.9762 20.1658 27.9762 24.0711 24.071C27.9763 20.1657 27.9763 13.8341 24.0711 9.92886C20.1658 6.02361 13.8342 6.02361 9.92893 9.92886C6.02369 13.8341 6.02369 20.1657 9.92893 24.071Z"
          stroke={color ? color : "#1F2937"}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default CancelOn;
