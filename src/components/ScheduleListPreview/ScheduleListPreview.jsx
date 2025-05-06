import React, { useEffect, useState } from "react";
import * as S from "./ScheduleListPreview.styled";
import ScheduleCard from "./ScheduleCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const ScheduleListPreview = () => {
  const [schedules, setSchedules] = useState([]);
  const schedulePreview = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/task/list/get");
      console.log("일정 불러오기 성공~!\n", res);
      setSchedules(res.data.result);
      return res;
    } catch (error) {
      console.log("일정 불러오기 실패~!\n", error);
      return error;
    }
  };

  useEffect(() => {
    schedulePreview();
  }, []);

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
