import React from "react";
import * as S from "./ProjectCard.styled";
import PersonOn from "../../assets/icons/Person/PersonOn";

const ProjectCard = ({ id }) => {
  const cardThemeColor = id % 2 === 0 ? "blue" : "yellow";
  return (
    <S.Container>
      <S.CardCover color={cardThemeColor} />
      <S.CardContentWrapper>
        <S.CardHeaderIcon color={cardThemeColor}>P</S.CardHeaderIcon>
        <S.CardTextWrapper>
          <S.CardTitle>Project: A</S.CardTitle>
          <S.CardDescription>
            Voluptates nemo autem et. Quia sit modi laudantium ut vitae maxime.
          </S.CardDescription>
        </S.CardTextWrapper>
        <S.ContributorsIconsWrapper>
          <S.ContributorsIcons left="0">
            <PersonOn color={"#5BA7F7"} />
          </S.ContributorsIcons>
          <S.ContributorsIcons left="10px" color={"#FEF9C3"}>
            <PersonOn color={"#FACC15"} />
          </S.ContributorsIcons>
          <S.ContributorsIcons left="20px" color={"lightgray 50%"}>
            <S.Text>+1</S.Text>
          </S.ContributorsIcons>
        </S.ContributorsIconsWrapper>
      </S.CardContentWrapper>
    </S.Container>
  );
};

export default ProjectCard;
