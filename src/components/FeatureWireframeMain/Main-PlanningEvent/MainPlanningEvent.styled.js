import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 641px;
  flex-shrink: 0;
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

const PreEventListContainer = styled.div`
  width: 641px;
  height: 707px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #fff;
  /* 1 */
  box-shadow: 0px 2px 9.4px 0px rgba(0, 0, 0, 0.08);
  padding: 31px;
`;

const PreEventList = styled.div`
  display: flex;
  width: 572px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`;

export { Container, ContainerText, PreEventListContainer, PreEventList };
