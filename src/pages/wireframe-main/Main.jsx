import { useState } from "react";
import * as S from "./Main.styled";
import Navbar from "../../components/FeatureWireframeMain/Navbar/Navbar";
import Sidebar from "../../components/FeatureWireframeMain/Sidebar/Sidebar";
import MainProjectList from "../../components/FeatureWireframeMain/Main-ProjectList/MainProjectList";
import MainPlanningEvent from "../../components/FeatureWireframeMain/Main-PlanningEvent/MainPlanningEvent";

const Main = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <S.Container>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <S.MainContent>
        {sidebarOpen && <Sidebar />}
        {/* {{ sidebarOpen } ? <Sidebar /> : null} */}
        <S.BodyContainer>
          <S.UserMessage>어쩌구님, 오늘도 힘차게 시작해볼까요!</S.UserMessage>
          <S.PreviewContainer>
            <MainProjectList />
            <MainPlanningEvent />
          </S.PreviewContainer>
        </S.BodyContainer>
      </S.MainContent>
    </S.Container>
  );
};

export default Main;
