import styled from "styled-components";

export const CoverSection = styled.div`
  height: 124px;
  align-self: stretch;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const CoverImagePreview = styled.div`
  width: 100%;
  height: 124px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-image: ${({ $image }) => `url(${$image})`};
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
  border: 1px solid var(--gray-200, #e5e7eb);
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
