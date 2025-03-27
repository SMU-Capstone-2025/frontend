import React from "react";
import * as S from "./Navbar.styled";
import Logo from "../../assets/icons/Logo/Logo";
import SidebarOn from "../../assets/icons/Sidebar/SidebarOn";
import HomeOn from "../../assets/icons/Home/HomeOn";
import BellOn from "../../assets/icons/Bell/BellOn";
import Button from "../Button/Button";

const Navbar = () => {
  return (
    <S.Container>
      <S.LeftsideWarpper>
        <S.IconButton>
          <SidebarOn />
        </S.IconButton>
        <S.IconButton>
          <HomeOn />
        </S.IconButton>
      </S.LeftsideWarpper>
      <S.LogoWarapper>
        <Logo />
      </S.LogoWarapper>
      <S.RightsideWarpper>
        <S.IconButton>
          <BellOn />
        </S.IconButton>
        <S.ProfileWrapper>
          <S.ProfileImage></S.ProfileImage>
          <S.ProfileName>독톡 님</S.ProfileName>
        </S.ProfileWrapper>
        <Button width={"fit-content"} height={"40px"} text={"화상 회의 시작"} />
      </S.RightsideWarpper>
    </S.Container>
  );
};

export default Navbar;
