import React from "react";

const Modal = ({ isOpen, onClose, onAdd, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white w-[1042px] h-[768px] mx-4 rounded-xl shadow-lg p-6 relative animate-fadeIn overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-gray-800 text-white rounded font-semibold hover:bg-gray-700 transition"
          >
            추가
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-400 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
