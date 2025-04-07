import styled from "styled-components";

const Container = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--gray-200, #e5e7eb);
  background: var(--0, #fff);
`;

const TextWrapper = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;
const ProjectTitle = styled.p`
  color: var(--gray-400, #9ca3af);

  /* xs Regular */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
  align-self: stretch;
`;
const ScheduleName = styled.p`
  color: var(--1000, #000);

  /* base Semi Bold */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 22.4px */
  letter-spacing: -0.32px;
  align-self: stretch;
`;

const ContributorsIconsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 24px;
  align-items: center;
  position: relative; /* Enable positioning for child elements */
`;

const ContributorsIcons = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  padding: 4px;
  align-items: center;
  border-radius: 500px;
  border: 1px solid var(--0, #fff);
  background: ${(props) => props.color || "var(--blue-100, #d5e8fc)"};
  position: relative; /* Position icons absolutely within the wrapper */
  right: ${(props) => props.right || "0px"}; /* Dynamically set the position */
`;
const Text = styled.p`
  width: 100%;
  height: 100%;
  color: var(--0, #fff);
  text-align: center;

  /* xs Bold */
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 14px */
`;

export {
  Container,
  TextWrapper,
  ProjectTitle,
  ScheduleName,
  ContributorsIconsWrapper,
  ContributorsIcons,
  Text,
};
