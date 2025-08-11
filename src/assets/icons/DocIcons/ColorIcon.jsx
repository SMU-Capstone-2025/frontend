import React from "react";

const ColorIcon = ({
  fill = "#FDF5DA",
  stroke = "#EEB800",
  letterColor = "#EEB800",
  size = 24,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect x="0.5" y="0.5" width="23" height="23" rx="1.5" fill={fill} />
      <rect x="0.5" y="0.5" width="23" height="23" rx="1.5" stroke={stroke} />
      <path
        d="M9.17188 17.3125H7L10.9844 6H13.4844L17.4844 17.3125H15.3125L14.375 14.5156H10.1094L9.17188 17.3125ZM10.6562 12.875H13.8281L12.2812 8.3125H12.1875L10.6562 12.875Z"
        fill={letterColor}
      />
    </svg>
  );
};

export default ColorIcon;
