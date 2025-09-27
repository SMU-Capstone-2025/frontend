import React from "react";

const Button = ({ type, width, height, text, color, onClick, disabled }) => {
  return (
    <button
      type={type || "button"}
      className={`flex justify-center items-center gap-2 rounded px-4 py-2 font-semibold font-['Livvic'] text-white bg-blue-500 cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-150`}
      style={{
        width: width || "auto",
        height: height || "auto",
        backgroundColor: color,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
