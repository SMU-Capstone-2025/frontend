import React, { useEffect, useRef, useState } from "react";
import defaultCover from "../../../assets/image/defaultCover.png";
import { fetchFileImage } from "../../../api/projectApi";
import { uploadFile } from "../../../api/taskApi";

const ProjectCoverUploader = ({ coverImage, setCoverImage }) => {
  const fileInputRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (typeof coverImage === "string" && coverImage.length === 24) {
        try {
          const url = await fetchFileImage(coverImage);
          setPreviewUrl(url);
        } catch (err) {
          console.error("서버 이미지 로딩 실패", err);
          setPreviewUrl(defaultCover);
        }
      } else {
        setPreviewUrl(coverImage || defaultCover);
      }
    };

    loadImage();
  }, [coverImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadedFile = await uploadFile(file);
      const fileId = uploadedFile.fileId || uploadedFile.id;
      if (!fileId) throw new Error("파일 업로드 결과에 fileId 없음");

      setCoverImage(fileId);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      console.error("커버 업로드 실패", err);
      alert("커버 업로드에 실패했습니다.");
    }
  };

  const handleFileClick = () => fileInputRef.current.click();

  return (
    <div className="relative max-h-[400px] self-stretch rounded-md overflow-hidden">
      {/* 커버 이미지 프리뷰 */}
      <img
        src={previewUrl || defaultCover}
        alt="프로젝트 커버"
        className="w-full h-full max-h-[400px] object-cover object-center p-1 cursor-pointer"
        onClick={() => setIsPreviewOpen(true)}
      />

      {/* 모달 프리뷰 */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70"
          onClick={() => setIsPreviewOpen(false)}
        >
          <img
            src={previewUrl}
            alt="커버 미리보기"
            className="max-w-[90vw] max-h-[70vh] rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* 숨겨진 파일 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 업로드 버튼 */}
      <button
        onClick={handleFileClick}
        className="absolute left-5 top-5 flex w-[130px] h-[30px] items-center justify-center gap-2 rounded bg-gray-300 px-3 py-1 cursor-pointer"
      >
        <span className="text-xs font-bold leading-[140%] text-gray-600">
          프로젝트 커버 추가
        </span>
      </button>
    </div>
  );
};

export default ProjectCoverUploader;
