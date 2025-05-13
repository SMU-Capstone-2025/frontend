import { useState } from "react";
import EllypsisOn from "../../assets/icons/Ellypsis/EllypsisOn";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Bell from "../../assets/icons/Bell/BellOn";
import Caesarzkn from "../../assets/icons/Caesarzkn/Caesarzkn";

const Modal = ({ isOpen, onClose, children, onDelete, showDelete }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  if (!isOpen) return null;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete?.();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[1042px] h-full max-h-[768px] p-[30px] flex flex-col items-end gap-5 rounded-xl border border-[#E5E7EB] relative animate-fadeIn overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 버튼 영역 */}
        <div className="flex items-start gap-5">
          {showDelete && (
            <div className="relative">
              {/* 설정 버튼 */}
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="hover:opacity-40 fill-[#D9D9D9]"
              >
                <EllypsisOn />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 flex flex-col items-start gap-3 px-4 py-[14px] rounded-lg border border-[#D2D5DA] bg-white z-20 w-[122px]">
                  {/* 삭제하기 버튼 */}
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 max-w-[90px] w-full rounded-md hover:w-[106px] hover:h-[36px] hover:rounded-[6px] hover:bg-[#D9D9D9] hover:opacity-40"
                  >
                    <Caesarzkn />
                    <span className="text-[#E40505] font-pretendard text-sm font-semibold leading-[140%] tracking-[-0.14px]">
                      삭제하기
                    </span>
                  </button>

                  {/* 알림받기 버튼 */}
                  <button className="flex items-center gap-2 max-w-[90px] w-full rounded-md hover:w-[106px] hover:h-[36px] hover:rounded-[6px] hover:bg-[#D9D9D9] hover:opacity-40">
                    <Bell />
                    <span className="text-[#374151] font-pretendard text-sm font-semibold leading-[140%] tracking-[-0.14px]">
                      알림받기
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={onClose} className="hover:opacity-40 fill-[#D9D9D9]">
            <CloseOn />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
