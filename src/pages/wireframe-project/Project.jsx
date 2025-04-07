import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ProjectTabs from "../../components/project-tabs/ProjectTabs";

const Project = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="flex flex-col justify-end items-start gap-6 pt-6 w-full max-w-screen-xl border-none">
        <ProjectTabs />
        <Outlet />
      </div>
    </div>
  );
};

export default Project;
