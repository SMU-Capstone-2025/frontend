import { useEffect, useRef, useState } from "react";
import EllypsisOn from "../../assets/icons/Ellypsis/EllypsisOn";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Bell from "../../assets/icons/Bell/BellOn";
import Caesarzkn from "../../assets/icons/Caesarzkn/Caesarzkn";

const Modal = ({ isOpen, onClose, onDelete, showDelete, children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 드롭다운 초기화
  useEffect(() => {
    if (isOpen) setIsDropdownOpen(false);
  }, [isOpen]);

  // 외부 클릭 감지 -> 드롭다운 false
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete?.();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] font-[Livvic]"
      onClick={onClose}
    >
      <div
        className="bg-white w-[95vw] h-[70vh] sm:w-[80vw] sm:h-[85vh] lg:w-[60vw] lg:h-[80vh] max-w-[1042px] max-h-[768px] p-[20px] sm:p-[30px] flex flex-col items-end gap-5 rounded-xl border border-[#E5E7EB] relative animate-fadeIn overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-5">
          {showDelete && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:opacity-40 fill-[#D9D9D9]"
              >
                <EllypsisOn />
              </button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 flex flex-col items-start gap-2 p-2 rounded-lg border border-[#D2D5DA] bg-white z-20 w-[140px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-1 w-full rounded-md hover:bg-[#D9D9D9] hover:opacity-40 p-1"
                  >
                    <Caesarzkn />
                    <span className="text-[#E40505] font-pretendard text-sm font-semibold">
                      삭제하기
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={onClose}
            className="hover:opacity-40 fill-[#D9D9D9] w-6 h-6"
          >
            <CloseOn />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
