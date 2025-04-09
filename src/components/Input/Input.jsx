import React from "react";

const Input = ({ type, title, placeholder, value, onChange, onBlur }) => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-1">
      <div className="justify-start text-gray-800 text-base font-semibold font-['Pretendard']">
        {title}
      </div>
      <input
        className="w-full h-12 py-3 px-4 rounded-lg outline outline-1 outline-gray-300 overflow-hidden"
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
