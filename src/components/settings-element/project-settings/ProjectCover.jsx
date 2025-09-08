import React, { useEffect, useRef, useState } from "react";
import * as S from "./ProjectCover.styled";
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
      // 파일 업로드
      const uploadedFile = await uploadFile(file);
      console.log("업로드된 파일 응답:", uploadedFile);

      const fileId = uploadedFile.fileId || uploadedFile.id;
      if (!fileId) {
        throw new Error("파일 업로드 결과에 fileId 없음");
      }
      // 프리뷰 적용
      setCoverImage(fileId);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    } catch (err) {
      console.error("❌ 커버 업로드 실패", err);
      alert("커버 업로드에 실패했습니다.");
    }
  };

  const handleFileClick = () => fileInputRef.current.click();

  return (
    <S.CoverSection>
      <S.CoverImagePreview
        src={previewUrl || defaultCover}
        alt="프로젝트 커버"
        onClick={() => setIsPreviewOpen(true)}
      />
      {isPreviewOpen && (
        <S.ModalBackdrop onClick={() => setIsPreviewOpen(false)}>
          <S.ModalImage src={previewUrl} onClick={(e) => e.stopPropagation()} />
        </S.ModalBackdrop>
      )}
      <S.HiddenFileInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      <S.CoverUploadButton onClick={handleFileClick}>
        <S.CoverUploadText>프로젝트 커버 추가</S.CoverUploadText>
      </S.CoverUploadButton>
    </S.CoverSection>
  );
};

export default ProjectCoverUploader;
