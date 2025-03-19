import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 72px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
`;

const IconWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  height: 48px;
  gap: 12px;
`;
const IconButton = styled.button`
  display: flex;
  height: 48px;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background: none;
  border: none;
`;
const ProfileWrapper = styled.div`
  display: flex;
  width: 127px;
  align-items: center;
  gap: 6px;
`;
const ProfileImage = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  gap: 8.333px;
  flex-shrink: 0;
  border-radius: 30px;
  background: var(--Bloo-Light-30, #ddd);
`;
const ProfileName = styled.p`
  display: flex;
  width: 81px;
  height: 27px;
  padding: 7px 8px;
  align-items: center;
  gap: -3px;
  flex-shrink: 0;
  color: #000;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
const VideoCallWrapper = styled.div`
  display: flex;
  width: 128px;
  height: 40px;
  padding: 10px 16px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 10px;
  background: #00cb9f;
`;
const VideoCallText = styled.p`
  color: #fff;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;
const HeaderText = styled.h1`
  color: #00cb9f;
  font-family: Spantaran;
  font-size: 26px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export {
  Container,
  IconWrapper,
  HeaderText,
  IconButton,
  VideoCallWrapper,
  VideoCallText,
  ProfileName,
  ProfileImage,
  ProfileWrapper,
};
