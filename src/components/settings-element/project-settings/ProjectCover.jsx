import React, { useRef } from "react";
import * as S from "./ProjectCover.styled";
import defaultCover from "../../../assets/image/defaultCover.png";

const ProjectCoverUploader = ({ coverImage, setCoverImage }) => {
  const fileInputRef = useRef();

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  return (
    <S.CoverSection>
      <S.CoverImagePreview $image={coverImage || defaultCover} />
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
