import { useNavigate } from "react-router-dom";
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

  // 문서 생성 일자 변환
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  // 문서 수정 시간 변환
  const formatDateTime = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    // 서버시간에 9시간 추가
    date.setHours(date.getHours() + 9);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenuId(isMenuOpen ? null : document.id);
  };

  return (
    <div className="flex w-full flex-col gap-3 relative font-[Livvic]">
      <div className="flex flex-col items-start justify-between w-full gap-4 pb-3 border-b border-gray-200 lg:flex-row lg:items-center hover:bg-gray-50">
        {/* 제목 & 최근 수정 */}
        <div
          className="flex flex-col justify-center items-start gap-[6px] w-full max-w-3xl cursor-pointer"
          onClick={() => {
            setOpenMenuId(null);
            navigate(`/document/${document.id}`, {
              state: { projectId },
            });
          }}
        >
          <span className="text-lg font-semibold tracking-tight text-gray-800 line-clamp-1">
            {document.title}
          </span>
          <span className="text-gray-400 font-[Palanquin] font-normal text-[12px] leading-[140%]">
            최근 수정: {formatDateTime(document.updatedAt)}
          </span>
        </div>

        {/* 모바일은 한 줄, sm 이상에서는 오른쪽 정렬 */}
        <div className="flex flex-row flex-wrap items-center justify-between w-full gap-3 sm:flex-row sm:justify-end sm:items-center sm:gap-11">
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
                    className="flex w-6 h-6 items-center justify-center rounded-full bg-black/50 text-white text-[11px] font-[500]"
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

          {/* 상태 */}
          <div className="w-[70px] flex justify-center sm:justify-end">
            <Status name={document.status} />
          </div>

          {/* 생성일 */}
          <span
            title="문서 생성 시간"
            className="text-sm font-normal tracking-tight text-gray-600 sm:text-lg"
          >
            {formatDate(document.createdAt)}
          </span>

          {/* 메뉴 버튼 */}
          <div className="relative">
            <div
              className="flex items-center justify-center w-6 h-6 cursor-pointer shrink-0 hover:bg-gray-100"
              onClick={handleToggleMenu}
            >
              <DrawerIcon />
            </div>
            {isMenuOpen && (
              <div className="absolute right-0 z-10 w-20 mt-1 bg-white border rounded shadow">
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
