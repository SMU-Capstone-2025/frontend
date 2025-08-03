import styled from "styled-components";

export const CoverSection = styled.div`
  max-height: 400px;
  align-self: stretch;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const CoverImagePreview = styled.img`
  width: 100%;
  height: 100%;
  max-height: 400px;
  object-position: center;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
`;

export const CoverUploadButton = styled.button`
  display: flex;
  width: 130px;
  height: 30px;
  padding: 6px 11px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: absolute;
  left: 20px;
  top: 20px;
  border-radius: 4px;
  /* border: 1px solid var(--gray-200, #e5e7eb); */
  background: var(--gray-300, #d2d5da);
  cursor: pointer;
`;

export const CoverUploadText = styled.span`
  color: var(--gray-600, #4b5563);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  object-fit: contain;
`;
