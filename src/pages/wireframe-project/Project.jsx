import React from "react";
import { Outlet, useParams } from "react-router-dom";
import ProjectTabs from "../../components/project-tabs/ProjectTabs";
import Layout from "../../components/NavbarLayout/Layout";

const Project = () => {
  const { projectId } = useParams();

  return (
    <Layout>
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col justify-end items-start gap-6 pt-6 w-full max-w-screen-xl border-none">
          <ProjectTabs projectId={projectId} />
          <Outlet context={{ projectId }} />
        </div>
      </div>
    </Layout>
  );
};

export default Project;
