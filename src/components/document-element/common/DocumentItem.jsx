import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DrawerIcon } from "../../../assets/icons/index";
import ProfileBlue from "../../../assets/icons/Profile/ProfileBlue";
import ProfileYellow from "../../../assets/icons/Profile/ProfileYellow";
import Status from "../../Status/Status";

const DocumentItem = ({
  projectId,
  document,
  onDelete,
  openMenuId,
  setOpenMenuId,
}) => {
  const navigate = useNavigate();
  const isMenuOpen = openMenuId === document.id;
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenuId(isMenuOpen ? null : document.id);
  };

  return (
    <div className="flex w-full flex-col gap-3 relative font-[Livvic]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full border-b pb-3 border-gray-200 gap-4 hover:bg-gray-100">
        <div
          className="flex flex-col justify-center items-start gap-[6px] w-full max-w-3xl cursor-pointer"
          onClick={() => {
            setOpenMenuId(null); // 메뉴 닫기
            navigate(`/document/${document.id}`, {
              state: { projectId },
            });
          }}
        >
          <span className="text-gray-800 text-lg font-semibold tracking-tight line-clamp-1">
            {document.title}
          </span>
          <span className="text-gray-400 font-[Palanquin] font-normal text-[12px] leading-[140%]">
            최근 수정: {formatDate(document.updatedAt)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-[15px] sm:gap-11">
          {/* editors */}
          <div className="flex items-center -space-x-2">
            {document.editors && document.editors.length > 0 ? (
              <>
                {document.editors.slice(0, 2).map((editor, idx) => (
                  <div key={idx} title={editor}>
                    {idx % 2 === 0 ? <ProfileBlue /> : <ProfileYellow />}
                  </div>
                ))}

                {document.editors.length > 2 && (
                  <div
                    className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700"
                    title={document.editors.slice(2).join(", ")}
                  >
                    +{document.editors.length - 2}
                  </div>
                )}
              </>
            ) : (
              <ProfileBlue />
            )}
          </div>

          <Status name={document.status} />
          <span className="text-gray-600 text-lg font-normal tracking-tight ">
            {formatDate(document.createdAt)}
          </span>

          {/* 메뉴 버튼 */}
          <div className="relative">
            <div
              className="flex w-6 h-6 justify-center items-center shrink-0 cursor-pointer hover:bg-gray-100"
              onClick={handleToggleMenu}
            >
              <DrawerIcon />
            </div>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-20 bg-white border rounded shadow z-10">
                <button
                  className="w-full px-2 py-[6px] text-sm font-[500] text-red-500 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(null); // 닫기
                    onDelete(document.id); // 삭제 실행
                  }}
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
