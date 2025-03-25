import React from "react";
import styled from "styled-components";

const ProjectPreviewCard = styled.div`
  display: flex;
  width: 364px;
  height: 256px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 20px;
  background: #fff;
  position: absolute;
  z-index: 1;
  /* 1 */
  box-shadow: 0px 2px 9.4px 0px rgba(0, 0, 0, 0.08);
`;

const CardCover = styled.div`
  height: 81px;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 20px 20px 0px 0px;
  background: #f1f1f1;
  z-index: 1;
`;

const CardContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
  align-self: stretch;
  position: relative;
  z-index: 10;
  top: -51px;
  left: 24px;
`;
const CardHeaderIcon = styled.div`
  width: 58px;
  height: 58px;
  fill: #d0d0d0;
`;
/* <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
  <circle cx="29" cy="29" r="29" fill="#D0D0D0"/>
</svg> */

const CardTitle = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
const CardDescription = styled.div`
  width: 316px;
  height: 44px;
  align-self: stretch;
  overflow: hidden;
  color: #787878;
  text-overflow: ellipsis;
  white-space: wrap;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ContributorWrapper = styled.div`
  width: 45px;
  height: 24px;
`;
const ContributorImage = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 0.5px solid #000;
  background: var(--Bloo-Light-30, #ddd);
`;

const MainProjectListCard = () => {
  return (
    <ProjectPreviewCard>
      <CardCover />
      <CardContentWrapper>
        <CardHeaderIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="58"
            height="58"
            viewBox="0 0 58 58"
            fill="none"
          >
            <circle cx="29" cy="29" r="29" fill="#D0D0D0" />
          </svg>
        </CardHeaderIcon>
        <CardTitle>Project : 어쩌구 ㅇ흠;ㄹㅁ</CardTitle>
        <CardDescription>
          Voluptates nemo autem et. Quia sit modi laudantium ut vitae maxime.
          Sunt voluptatibus est consequatur ut possimus maxime. Aut sint eos
          ducimus.
        </CardDescription>
        <ContributorWrapper>
          <ContributorImage>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.10981 16.1111C5.9564 16.1111 5.83203 15.9868 5.83203 15.8334V12.7778C5.83203 11.3971 6.95131 10.2778 8.33202 10.2778L11.6654 10.2778C13.0461 10.2778 14.1654 11.3971 14.1654 12.7778V15.8334C14.1654 15.9868 14.041 16.1111 13.8876 16.1111C13.7342 16.1111 13.6098 15.9868 13.6098 15.8334V12.7778C13.6098 11.7039 12.7392 10.8334 11.6654 10.8334L8.33202 10.8334C7.25814 10.8334 6.38759 11.7039 6.38759 12.7778V15.8334C6.38759 15.9868 6.26322 16.1111 6.10981 16.1111ZM12.7765 6.66669C12.7765 8.20082 11.5328 9.44447 9.9987 9.44447C8.46457 9.44447 7.22092 8.20082 7.22092 6.66669C7.22092 5.13257 8.46457 3.88892 9.9987 3.88892C11.5328 3.88892 12.7765 5.13257 12.7765 6.66669ZM9.9987 8.88892C11.226 8.88892 12.2209 7.89399 12.2209 6.66669C12.2209 5.43939 11.226 4.44447 9.9987 4.44447C8.7714 4.44447 7.77648 5.43939 7.77648 6.66669C7.77648 7.89399 8.7714 8.88892 9.9987 8.88892Z"
                fill="#555555"
              />
            </svg>
          </ContributorImage>
          <ContributorImage>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.10981 16.1111C5.9564 16.1111 5.83203 15.9868 5.83203 15.8334V12.7778C5.83203 11.3971 6.95131 10.2778 8.33202 10.2778L11.6654 10.2778C13.0461 10.2778 14.1654 11.3971 14.1654 12.7778V15.8334C14.1654 15.9868 14.041 16.1111 13.8876 16.1111C13.7342 16.1111 13.6098 15.9868 13.6098 15.8334V12.7778C13.6098 11.7039 12.7392 10.8334 11.6654 10.8334L8.33202 10.8334C7.25814 10.8334 6.38759 11.7039 6.38759 12.7778V15.8334C6.38759 15.9868 6.26322 16.1111 6.10981 16.1111ZM12.7765 6.66669C12.7765 8.20082 11.5328 9.44447 9.9987 9.44447C8.46457 9.44447 7.22092 8.20082 7.22092 6.66669C7.22092 5.13257 8.46457 3.88892 9.9987 3.88892C11.5328 3.88892 12.7765 5.13257 12.7765 6.66669ZM9.9987 8.88892C11.226 8.88892 12.2209 7.89399 12.2209 6.66669C12.2209 5.43939 11.226 4.44447 9.9987 4.44447C8.7714 4.44447 7.77648 5.43939 7.77648 6.66669C7.77648 7.89399 8.7714 8.88892 9.9987 8.88892Z"
                fill="#555555"
              />
            </svg>
          </ContributorImage>
          <ContributorImage>+3</ContributorImage>
        </ContributorWrapper>
      </CardContentWrapper>
    </ProjectPreviewCard>
  );
};

export default MainProjectListCard;
