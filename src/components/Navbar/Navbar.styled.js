import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1920px;
  height: 64px;
  border-bottom: 1px solid var(--gray-200, #e5e7eb);
  background: var(--0, #fff);
  padding: 0px 20px;
`;

const LeftsideWarpper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const IconButton = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const RightsideWarpper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;
const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const ProfileImage = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  padding: 6.667px;
  align-items: center;
  gap: 16.667px;
`;
const ProfileName = styled.p`
  display: flex;
  width: fit-content;
  height: 27px;
  align-items: center;
`;

//화상회의시작 버튼만 넣으면 일단 구조는 긑
//버튼 컴포넌트 만들고 다시 오자

const LogoWarapper = styled.div`
  display: flex;
  height: 64px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export {
  Container,
  LeftsideWarpper,
  RightsideWarpper,
  ProfileWrapper,
  ProfileImage,
  ProfileName,
  LogoWarapper,
  IconButton,
};
