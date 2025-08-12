import React from "react";
import CircleOkOn from "../../assets/icons/CircleOk/CircleOkOn";
import CancelOn from "../../assets/icons/Cancel/CancelOn";

const Input = ({
  type,
  title,
  placeholder,
  value,
  onChange,
  onBlur,
  onSuccess,
  required = true,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-1">
      <div className="justify-start text-gray-800 text-base font-semibold font-['Palanquin']">
        {title}
      </div>
      <div className="w-full flex justify-start items-center gap-2 rounded-lg outline outline-1 outline-gray-300">
        <input
          className="w-full h-12 py-2 px-3 text-black text-base font-normal font-['Palanquin'] overflow-hidden"
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
        />
        {onSuccess == true && <CircleOkOn color={"blue"} />}
        {onSuccess == false && <CancelOn color={"red"} />}
      </div>
    </div>
  );
};

export default Input;
