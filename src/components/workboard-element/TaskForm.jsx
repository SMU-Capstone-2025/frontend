import React from "react";
import ProfileBlue from "../../assets/icons/Profile/ProfileBlue";
import StatusSelect from "../Status/StatusSelect";
import {
  changeTaskStatus,
  deleteFile,
  getTaskDetails,
  uploadFile,
} from "../../api/taskApi";
import { fetchFileBlob } from "../../api/taskApi";
import { FileIcon } from "../../assets/icons/FileIcon/FileIcon";
import useTaskColumn from "../../hooks/useTaskColumn";

const TaskForm = ({
  newTask,
  setNewTask,
  newFiles,
  setNewFiles,
  token,
  onStatusUpdate,
  error,
  projectId,
}) => {
  const { loadTaskDetails, saveTaskAfterFileDelete, saveTaskWithFile } =
    useTaskColumn(projectId);

  // input 값 변경 핸들러(제목, 마감일, 내용 사용)
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  // 작업 status 값 변경 핸들러
  const handleStatusChange = async (newStatus) => {
    setNewTask((prev) => ({ ...prev, status: newStatus }));

    try {
      // taskId가 존재할 때만 변경 요청
      if (newTask.taskId) {
        await changeTaskStatus(newTask.taskId, newStatus, token);
      }
    } catch (err) {
      console.error("상태 변경 실패", err);
    }
  };

  // 파일 선택 시 업로드 처리
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0 || !newTask.taskId) return;

    try {
      for (const file of selectedFiles) {
        await saveTaskWithFile(newTask, file); // ✅ 파일 업로드용 함수로 변경
      }

      const updatedDetails = await loadTaskDetails(newTask.taskId);
      setNewTask(updatedDetails);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "알 수 없는 오류";
      console.error("❌ 파일 업로드 실패:", message);
      alert(`❌ 파일 업로드 실패: ${message}`);
    }
  };

  // 파일 다운로드 로직
  const handleFileDownload = async (fileId) => {
    try {
      const { blob, headers } = await fetchFileBlob(fileId, token);

      // 파일명 파싱
      let filename = "downloaded_file";
      const disposition = headers["content-disposition"];
      if (disposition) {
        const match = disposition.match(/filename\*=UTF-8''(.+)/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      // 다운로드 실행
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ 파일 다운로드 실패", err);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await deleteFile(fileId, token); // 1. 파일 삭제

      await saveTaskAfterFileDelete(newTask, fileId); // ✅ 삭제 후 버전 저장 (fileId만 넘김)

      const updated = await getTaskDetails(newTask.taskId, token); // 3. 최신 정보
      setNewTask(updated.result); // 4. 반영
    } catch (err) {
      console.error("❌ 파일 삭제 실패", err);
      alert("파일 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[982px] h-full max-h-[686px] justify-between items-start overflow-y-auto">
      <section className="flex flex-col w-full items-start gap-[30px]">
        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="작업 제목"
          value={newTask.title || ""}
          onChange={handleInputChange("title")}
          className="w-full text-[28px] font-bold leading-[120%] tracking-[-1.12px] font-[Palanquin] placeholder:text-black hover:outline-none hover:border-none focus:outline-none focus:border-none"
        />

        <section className="flex flex-col w-full gap-[15px] font-[Palanquin]">
          {/* 상태 선택 */}
          <div className="flex items-center gap-4">
            <StatusSelect
              value={newTask.status}
              onChange={handleStatusChange}
            />
          </div>

          {/* 마감 기한 */}
          <div className="flex items-center gap-[17px] font-[Livvic]">
            <p className="text-[#4B5563] text-[16px] font-semibold leading-[140%] tracking-[-0.32px] opacity-50">
              기한
            </p>
            <input
              type="date"
              value={newTask.deadline || ""}
              onChange={handleInputChange("deadline")}
              className="appearance-none bg-transparent text-[16px] font-semibold leading-[140%] tracking-[-0.32px] w-full max-w-[115px] "
            />
          </div>

          {/* 담당자 아이콘 -> 동적 처리 예정 */}
          <div className="flex items-center gap-[17px] font-[Livvic]">
            <p className="text-[#4B5563] text-[16px] font-semibold leading-[140%] tracking-[-0.32px] opacity-50">
              담당자
            </p>
            <div className="flex items-center gap-2">
              <ProfileBlue />
              <ProfileBlue />
              <ProfileBlue />
            </div>
          </div>

          {/* 작업 설명 */}
          <textarea
            rows={18}
            placeholder="작업 내용을 입력하세요"
            value={newTask.content || ""}
            onChange={handleInputChange("content")}
            className="w-full px-[9px] py-2 text-sm border-t font-[Palanquin] outline-none resize-none text-gray-600"
          />
          {/* 파일 업로드 & 첨부파일 목록 */}
          <div className="flex flex-col gap-2 mt-2 w-full max-w-[244px]">
            {/* 파일 추가 버튼 */}
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 px-3 py-3 bg-[#F3F4F6] text-gray-800 rounded-lg font-[Palanquin] text-[12px] not-italic font-normal leading-[140%] cursor-pointer hover:bg-[#E5E7EB] transition-colors duration-150"
            >
              <FileIcon className=" text-gray-500" />
              파일 추가
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* 첨부파일 미리보기 */}
            {newTask.attachmentList?.filter(Boolean).map((file, idx) => (
              <div
                key={file.fileId}
                className="flex items-center justify-between px-3 py-3 bg-[#F3F4F6] rounded-lg"
              >
                <button
                  onClick={() => handleFileDownload(file.fileId)}
                  className="flex items-center gap-2 text-gray-800 text-[12px] font-normal leading-[140%] font-[Palanquin] hover:underline"
                >
                  <FileIcon />
                  <span
                    title={file.fileName}
                    className="truncate max-w-[160px] block"
                  >
                    [첨부파일 {idx + 1}] {file.fileName || "파일명 없음"}
                  </span>
                </button>
                <button
                  onClick={() => handleFileDelete(file.fileId)}
                  className="text-red-500 text-xs ml-2 hover:underline"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default TaskForm;
