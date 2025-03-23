import React from "react";
import {
  ModalBackground,
  ModalContainer,
  CloseButton,
  AddButton,
} from "./Modal.styled";

const Modal = ({ isOpen, onClose, onAdd, children }) => {
  return (
    <ModalBackground $isOpen={isOpen} onClick={onClose}>
      <ModalContainer $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        {children}
        <AddButton onClick={onAdd}>추가</AddButton>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContainer>
    </ModalBackground>
  );
};

export default Modal;
