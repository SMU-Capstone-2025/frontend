import { DrawerIcon } from "../../../assets/icons/index";
import ProfileBlue from "../../../assets/icons/Profile/ProfileBlue";
import ProfileYellow from "../../../assets/icons/Profile/ProfileYellow";
import Status from "../../Status/Status";

const DocumentItem = ({ document }) => {
  return (
    <div className="flex w-full flex-col gap-3 pb-3">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full border-b border-gray-200 gap-4">
        {/* 제목 */}
        <div className="flex flex-col justify-center items-start gap-1.5 w-full max-w-3xl">
          <span className="text-gray-800 text-lg font-semibold tracking-tight font-pretendard line-clamp-1">
            {document.title}
          </span>
        </div>

        {/* 프로필 아이콘 */}
        <div className="flex items-center -space-x-2">
          <ProfileBlue />
          <ProfileYellow />
          <ProfileBlue />
        </div>

        {/* 상태 + 날짜 + 옵션 아이콘 */}
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3 sm:gap-11">
          <Status name="진행 중" backgroundColor="beige" fontColor="black" />
          <span className="text-gray-600 text-lg font-normal tracking-tight font-pretendard">
            {document.updatedAt}
          </span>
          <div
            className="flex w-6 h-6 justify-center items-center shrink-0 cursor-pointer"
            onClick={() => {
              console.log("Click 더보기");
            }}
          >
            <DrawerIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;
