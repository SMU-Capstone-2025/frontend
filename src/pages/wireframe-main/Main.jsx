import React from "react";
import * as S from "./Main.styled";
import Navbar from "../../components/FeatureWireframeMain/Navbar/Navbar";
import Sidebar from "../../components/FeatureWireframeMain/Sidebar/Sidebar";

const Main = () => {
  return (
    <S.Container>
      <Navbar />
      <S.MainContent>
        <Sidebar />
      </S.MainContent>
    </S.Container>
  );
};

export default Main;
