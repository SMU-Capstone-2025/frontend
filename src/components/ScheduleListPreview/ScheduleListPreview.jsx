import React from "react";
import * as S from "./ScheduleListPreview.styled";
import ScheduleCard from "./ScheduleCard";

const ScheduleListPreview = () => {
  return (
    <S.Container>
      <S.DateWrapper>
        <S.DdayText>D-DAY</S.DdayText>
        <S.DateText>00월 00일 월요일</S.DateText>
      </S.DateWrapper>
      <S.CardList>
        <ScheduleCard />
        <ScheduleCard />
        <ScheduleCard />
      </S.CardList>
    </S.Container>
  );
};

export default ScheduleListPreview;
