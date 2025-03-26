import React from "react";
import * as S from "./MainPlanningEvent.styled";
import Main from "../../../pages/wireframe-main/Main";
import MainPlanningEventCard from "./MainPlanningEventCard/MainPlanningEventCard";

const MainPlanningEvent = () => {
  return (
    <S.Container>
      <S.ContainerText>예정된 이벤트</S.ContainerText>
      <S.PreEventListContainer>
        <S.PreEventList>
          <MainPlanningEventCard />
        </S.PreEventList>
      </S.PreEventListContainer>
    </S.Container>
  );
};

export default MainPlanningEvent;
