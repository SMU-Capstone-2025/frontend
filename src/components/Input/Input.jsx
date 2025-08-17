import React, { use } from "react";
import CircleOkOn from "../../assets/icons/CircleOk/CircleOkOn";
import CancelOn from "../../assets/icons/Cancel/CancelOn";
import Button from "../Button/Button";

const Input = ({
  type,
  title,
  placeholder,
  value,
  onChange,
  onBlur,
  onSuccess,
  required = true,
  useButton = false,
  onClick,
  errmsg,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-1">
      <div className="w-full justify-start text-gray-800 text-base font-semibold font-['Palanquin']">
        {title}
      </div>
      <div className="w-full flex justify-start items-start gap-2.5">
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
        {useButton && (
          <Button
            type={"button"}
            width={"84px"}
            height={"100%"}
            text={"초대"}
            onClick={onClick}
          />
        )}
      </div>
      {onSuccess === false && (
        <div className="text-red-600 text-sm font-['Palanquin']">{errmsg}</div>
      )}
    </div>
  );
};

export default Input;
