import React from "react";
import LinkOn from "../../../assets/icons/Link/LinkOn";
import PlusOn from "../../../assets/icons/Plus/PlusOn";

const AddMemberForm = ({ email, onChange, onAdd, onCopyLink }) => {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* 입력창 */}
      <div className="flex items-center justify-center w-full max-w-[403px] h-10">
        <input
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={onChange}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-2">
        {/* 링크 복사 버튼 */}
        <button
          title="초대 링크 복사"
          onClick={onCopyLink}
          className="flex items-center justify-center h-10 w-10 rounded border border-gray-200 bg-white text-base cursor-pointer hover:bg-gray-50"
        >
          <LinkOn />
        </button>

        {/* 멤버 추가 버튼 */}
        <button
          title="멤버 추가"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-1 h-10 rounded bg-[#3191f2] px-2 text-sm font-medium sm:px-4 text-white hover:bg-blue-600"
        >
          <PlusOn color="#fff" />
          {/* 모바일에서는 숨기고, sm 이상에서만 표시 */}
          <span className="hidden sm:inline text-white text-sm font-semibold leading-snug tracking-[-0.14px] whitespace-nowrap">
            멤버 추가
          </span>
        </button>
      </div>
    </div>
  );
};

export default AddMemberForm;
