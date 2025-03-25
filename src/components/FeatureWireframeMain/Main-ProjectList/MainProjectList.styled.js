import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 364px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ContainerText = styled.div`
  color: #888;
  font-family: Inter;
  font-size: 10.916px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ProjectPreviewCardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 38px;
  align-self: stretch;
`;

export { Container, ContainerText, ProjectPreviewCardList };
