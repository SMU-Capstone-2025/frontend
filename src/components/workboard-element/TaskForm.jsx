import React, { useEffect, useRef, useState } from "react";
import ProfileBlue from "../../assets/icons/Profile/ProfileBlue";
import StatusSelect from "../Status/StatusSelect";
import { deleteFile, getTaskDetails, fetchFileBlob } from "../../api/taskApi";
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
  coworkers = [],
}) => {
  const {
    loadTaskDetails,
    saveTaskAfterFileDelete,
    saveTaskWithFile,
    autoSaveTask,
  } = useTaskColumn(projectId);

  const [pickerOpen, setPickerOpen] = useState(false);
  const formRef = useRef(null); // 전체 스크롤 컨테이너 ref
  const textareaRef = useRef(null); // textarea ref

  // 파일 첨부 변경 시 -> 맨 아래
  useEffect(() => {
    if (!formRef.current) return;
    formRef.current.scrollTop = formRef.current.scrollHeight;
  }, [newTask.attachmentList]);

  // 작업 변경 시 (taskId 바뀌면 새 작업 열렸다고 판단) -> 스크롤 맨 위
  useEffect(() => {
    if (!formRef.current) return;
    formRef.current.scrollTop = 0;
  }, [newTask.taskId]);

  // textarea 자동 리사이즈 (불러오기 + 입력시)
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [newTask.content]);

  const handleToggleCoworker = (email) => {
    setNewTask((prev) => {
      const ids = prev.coworkers || [];
      const next = ids.includes(email)
        ? ids.filter((e) => e !== email)
        : [...ids, email];

      const updatedTask = {
        ...prev,
        coworkers: next, // UI 표시용
        editors: next, // 저장용
      };

      // UI 반영
      if (updatedTask.taskId) {
        setTimeout(() => autoSaveTask(updatedTask), 0);
      }
      return updatedTask;
    });
  };

  // ediotrs 표시(최대 2명 + +N)
  const selected = (newTask.coworkers || [])
    .map((mail) => coworkers.find((c) => c.email === mail))
    .filter(Boolean);

  // input 값 변경 핸들러(제목, 마감일, 내용 사용)
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  // 작업 status 값 변경 핸들러
  const handleStatusChange = async (newStatus) => {
    setNewTask((prev) => ({ ...prev, status: newStatus }));
    try {
      if (newTask.taskId) {
        await onStatusUpdate(newTask.taskId, newStatus);
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
        await saveTaskWithFile(newTask, file);
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
      await deleteFile(fileId, token);
      await saveTaskAfterFileDelete(newTask, fileId);
      const updated = await getTaskDetails(newTask.taskId, token);
      setNewTask(updated.result);
    } catch (err) {
      console.error("❌ 파일 삭제 실패", err);
      alert("파일 삭제에 실패했습니다.");
    }
  };

  return (
    <div
      ref={formRef}
      className="flex flex-col w-full max-w-[982px] h-full max-h-[686px] justify-between items-start overflow-y-auto"
    >
      <section className="flex flex-col w-full items-start gap-[30px]">
        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="작업 제목"
          value={newTask.title || ""}
          onChange={handleInputChange("title")}
          className="w-full text-[28px] font-bold leading-[120%] tracking-[-1.12px] font-[Palanquin] placeholder:text-black outline-none"
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
            <p className="text-[#4B5563] text-[16px] font-semibold opacity-50">
              기한
            </p>
            <input
              type="date"
              value={newTask.deadline || ""}
              onChange={handleInputChange("deadline")}
              className="appearance-none bg-transparent text-[16px] font-semibold w-full max-w-[115px]"
            />
          </div>

          {/* 담당자 */}
          <div className="relative">
            <div
              className="flex items-center gap-[17px] font-[Livvic] cursor-pointer"
              onClick={() => setPickerOpen((prev) => !prev)}
            >
              <p className="text-[#4B5563] text-[16px] font-semibold opacity-50">
                담당자
              </p>
              <div className="flex items-center gap-2">
                {selected.slice(0, 10).map((c) => (
                  <div key={c.email} title={`${c.name} (${c.email})`}>
                    <ProfileBlue />
                  </div>
                ))}
              </div>
            </div>

            {pickerOpen && (
              <div className="absolute z-50 w-40 mt-1 bg-white border rounded shadow-lg left-14">
                {coworkers.map((c) => {
                  const isSelected = newTask.coworkers?.includes(c.email);
                  return (
                    <button
                      key={c.email}
                      onClick={() => handleToggleCoworker(c.email)}
                      className={`w-full px-4 py-2 flex items-center gap-3 ${
                        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                    >
                      <ProfileBlue />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 작업 설명 */}
          <textarea
            ref={textareaRef}
            placeholder="작업 내용을 입력하세요"
            value={newTask.content || ""}
            onChange={handleInputChange("content")}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="w-full px-[9px] py-2 text-sm border-t font-[Palanquin] outline-none resize-none text-gray-600 overflow-hidden min-h-[220px]"
          />

          {/* 파일 업로드 & 첨부파일 목록 */}
          <div className="flex flex-col gap-2 mt-2 w-full max-w-[244px]">
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 px-3 py-3 bg-[#F3F4F6] text-gray-800 rounded-lg text-[12px] cursor-pointer hover:bg-[#E5E7EB]"
            >
              <FileIcon className="text-gray-500" />
              파일 추가
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {newTask.attachmentList?.filter(Boolean).map((file, idx) => (
              <div
                key={file.fileId}
                className="flex items-center justify-between px-3 py-3 bg-[#F3F4F6] rounded-lg"
              >
                <button
                  onClick={() => handleFileDownload(file.fileId)}
                  className="flex items-center gap-2 text-gray-800 text-[12px] hover:underline"
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
                  className="ml-2 text-xs text-red-500 hover:underline"
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
