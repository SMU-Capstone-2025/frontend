import React from "react";
import * as S from "./Button.styled";

const Button = ({ width, height, text, color }) => {
  return (
    <S.Container width={width} height={height} color={color}>
      <S.Text>{text}</S.Text>
    </S.Container>
  );
};

export default Button;
