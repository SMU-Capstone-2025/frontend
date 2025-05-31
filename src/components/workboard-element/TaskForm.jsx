import React from "react";
import ProfileBlue from "../../assets/icons/Profile/ProfileBlue";
import StatusSelect from "../Status/StatusSelect";
import { changeTaskStatus, uploadFile } from "../../api/taskApi";

const TaskForm = ({
  newTask,
  setNewTask,
  newFiles,
  setNewFiles,
  token,
  onStatusUpdate,
}) => {
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
    const selectedFiles = Array.from(e.target.files); // 다중 선택된 파일 배열로 변환
    setNewFiles(selectedFiles);

    if (selectedFiles.length === 0) return;

    try {
      // 선택된 각 파일을 서버에 업로드 -> fileId 배열 획득
      const uploadedFileIds = await Promise.all(
        selectedFiles.map((file) => uploadFile(file, token))
      );

      setNewTask((prev) => ({
        ...prev,
        attachmentList: uploadedFileIds,
      }));

      console.log("✅ 파일 업로드 완료:", uploadedFileIds);
    } catch (err) {
      console.error("❌ 파일 업로드 실패:", err);
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
          className="w-full text-[28px] font-bold leading-[120%] tracking-[-1.12px] placeholder:text-black"
        />

        <section className="flex flex-col w-full gap-[15px]">
          {/* 상태 선택 */}
          <div className="flex items-center gap-4">
            <StatusSelect
              value={newTask.status}
              onChange={handleStatusChange}
            />
          </div>

          {/* 마감 기한 */}
          <div className="flex items-center gap-[17px]">
            <p className="text-[#4B5563] text-[16px] font-semibold leading-[140%] tracking-[-0.32px] opacity-50">
              기한
            </p>
            <input
              type="date"
              value={newTask.deadline || ""}
              onChange={handleInputChange("deadline")}
              className="appearance-none bg-transparent text-[16px] font-semibold leading-[140%] tracking-[-0.32px] w-full max-w-[115px]"
            />
          </div>

          {/* 담당자 아이콘 -> 동적 처리 예정 */}
          <div className="flex items-center gap-[17px]">
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
            className="w-full px-4 py-2 mt-3 text-sm border border-gray-300 rounded outline-none resize-none focus:border-blue-500"
          />

          {/* 파일 첨부 */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-4"
          />
        </section>
      </section>
    </div>
  );
};

export default TaskForm;
