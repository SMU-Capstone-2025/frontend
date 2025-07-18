import React, { useState } from "react";

const statusOption = {
  PENDING: { label: "진행 전", bg: "#FEF08A", color: "#713f12" },
  PROGRESS: { label: "진행 중", bg: "#FECACA", color: "#991B1B" },
  COMPLETED: { label: "완료", bg: "#D5E8FC", color: "#064488" },
};

const StatusSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = statusOption[value] || statusOption.PENDING;

  const handleSelect = (newStatus) => {
    onChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          backgroundColor: current.bg,
          color: current.color,
        }}
        className="flex h-[31.72px] px-3 py-2 justify-center items-center gap-2.5 rounded-md text-sm font-semibold"
      >
        {current.label}
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-[2px] bg-white border rounded shadow">
          {Object.entries(statusOption).map(([key, { label }]) => (
            <li
              key={key}
              onClick={() => handleSelect(key)}
              className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100"
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatusSelect;
