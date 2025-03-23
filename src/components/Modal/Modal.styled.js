import styled from "styled-components";

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "scale(1)" : "scale(0.95)")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
`;

export const ButtonBase = styled.button`
  padding: 7px 12px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 4px;
`;

export const CloseButton = styled(ButtonBase)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    opacity: 0.3;
  }
`;

export const AddButton = styled(ButtonBase)`
  background-color: #2c3e50;
  color: white;

  &:hover {
    opacity: 0.3;
  }
`;
