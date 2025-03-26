import React from "react";
import * as S from "./MainPlanningEventCard.styled";

const MainPlanningEventCard = () => {
  return (
    <S.Container>
      <S.LeftsideDateView>
        <S.DateText>오늘! 00월00일</S.DateText>
        <S.DDayText>D-Day</S.DDayText>
      </S.LeftsideDateView>
      <S.RightsideWorkView></S.RightsideWorkView>
    </S.Container>
  );
};

export default MainPlanningEventCard;
