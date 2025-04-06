import React from "react";
import * as S from "./DoctalkMain.styled";
//import { NavBar } from "../wireframe-project/Project.styled";
import Navbar from "../../components/Navbar/Navbar";

const DoctalkMain = () => {
  return (
    <S.Container>
      <Navbar />
      <S.MainContentContainer>
        <S.WelcomeCommentText>
          독톡님, 오늘도 힘차게 시작해볼까요!
        </S.WelcomeCommentText>
      </S.MainContentContainer>
    </S.Container>
  );
};

export default DoctalkMain;
