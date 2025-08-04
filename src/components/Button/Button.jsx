import React from "react";

const Button = ({ width, height, text, color, onClick }) => {
  return (
    <button
      type="button"
      className={`flex justify-center items-center gap-2 rounded px-4 py-2 font-semibold text-white bg-blue-500 cursor-pointer`}
      style={{
        width: width || "auto",
        height: height || "auto",
        backgroundColor: color || undefined,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
