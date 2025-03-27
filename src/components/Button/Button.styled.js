import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: ${(props) => props.width || "48px"};
  height: ${(props) => props.height || "24px"};
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 4px;
  border: ${(props) =>
    props.color ? "1px solid var(--gray-200, #e5e7eb)" : "none"};
  background: ${(props) => props.color || "var(--blue-500, #3191f2)"};
  cursor: pointer;
`;

const Text = styled.p`
  color: var(--0, #fff);
  text-align: center;

  /* sm Semi Bold */
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
  letter-spacing: -0.14px;
`;

export { Container, Text };
