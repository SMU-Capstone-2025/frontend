import React from "react";
import * as S from "./ScheduleCard.styled";
import PersonOn from "../../assets/icons/Person/PersonOn";

const ScheduleCard = () => {
  return (
    <S.Container>
      <S.TextWrapper>
        <S.ProjectTitle>project: A</S.ProjectTitle>
        <S.ScheduleName>어쩌구저쩌는 일하기</S.ScheduleName>
      </S.TextWrapper>
      <S.ContributorsIconsWrapper>
        <S.ContributorsIcons right="-28px">
          <PersonOn color={"#5BA7F7"} />
        </S.ContributorsIcons>
        <S.ContributorsIcons right="-14px" color={"#FEF9C3"}>
          <PersonOn color={"#FACC15"} />
        </S.ContributorsIcons>
        <S.ContributorsIcons right="0px" color={"lightgray 50%"}>
          <S.Text>+1</S.Text>
        </S.ContributorsIcons>
      </S.ContributorsIconsWrapper>
    </S.Container>
  );
};

export default ScheduleCard;
