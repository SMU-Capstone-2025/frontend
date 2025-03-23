import React from "react";
import { Outlet } from "react-router-dom";
import { DocumentIcon, SettingsIcon, WorkBoardIcon } from "../../assets/icons/";
import {
  NavBar,
  TabsContainer,
  TabLink,
  ProjectContainer,
} from "./Project.styled";

const Project = () => {
  return (
    <ProjectContainer>
      <NavBar>상단바</NavBar>
      <TabsContainer>
        <TabLink to="/project/workboard">
          <WorkBoardIcon />
          작업 보드
        </TabLink>
        <TabLink to="/project/document">
          <DocumentIcon />
          문서
        </TabLink>
        <TabLink to="/project/settings">
          <SettingsIcon />
          설정
        </TabLink>
      </TabsContainer>
      <Outlet />
    </ProjectContainer>
  );
};

export default Project;
