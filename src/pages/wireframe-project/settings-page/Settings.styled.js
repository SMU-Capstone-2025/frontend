import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;
  width: 1280px;
  font-family: Palanquin;
`;

export const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-weight: bold;
  background-color: #45624e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #354b3a;
  }
`;
