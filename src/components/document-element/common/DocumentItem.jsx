import { useState } from "react";
import { DrawerIcon } from "../../../assets/icons/index";
import ProfileBlue from "../../../assets/icons/Profile/ProfileBlue";
import ProfileYellow from "../../../assets/icons/Profile/ProfileYellow";
import Status from "../../Status/Status";
import { useNavigate } from "react-router-dom";

const DocumentItem = ({ document, onDelete }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  return (
    <div className="flex w-full flex-col gap-3 pb-3 relative ">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full border-b border-gray-200 gap-4">
        <div
          className="flex flex-col justify-center items-start gap-1.5 w-full max-w-3xl cursor-pointer hover:opacity-40"
          onClick={() =>
            navigate("/project/document/new", {
              state: { documentId: document.id },
            })
          }
        >
          <span className="text-gray-800 text-lg font-semibold tracking-tight font-pretendard line-clamp-1">
            {document.title}
          </span>
        </div>

        <div className="flex items-center -space-x-2">
          <ProfileBlue />
          <ProfileYellow />
          <ProfileBlue />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3 sm:gap-11">
          <Status name={document.status} />
          <span className="text-gray-600 text-lg font-normal tracking-tight font-pretendard">
            {formatDate(document.updatedAt)}
          </span>
          <div className="relative">
            <div
              className="flex w-6 h-6 justify-center items-center shrink-0 cursor-pointer hover:bg-gray-100"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <DrawerIcon />
            </div>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-20 bg-white border rounded shadow z-10">
                <button
                  className="w-full px-2 py-1 text-sm text-red-500 hover:bg-gray-100"
                  onClick={() => onDelete(document.id)}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;
