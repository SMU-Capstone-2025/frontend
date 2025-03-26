import { Navigate } from "react-router-dom";
import Main from "../pages/wireframe-main/Main";
import Project from "../pages/wireframe-project/Project";
import VideoRoom from "../pages/wireframe-videoroom/VideoRoom";
import RootLayout from "../layout/root-layout";
// import Settings from "../pages/wireframe-project/SettingsPage/Settings";
// import WorkBoard from "../pages/wireframe-project/WorkBoardPage/WorkBoard";
// import Document from "../pages/wireframe-project/DocumentPage/Document";

const Router = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Main /> },
      {
        path: "project",
        element: <Project />,
        children: [
          { index: true, element: <Navigate to="workboard" /> },
          // { path: "workboard", element: <WorkBoard /> },
          // { path: "document", element: <Document /> },
          // { path: "settings", element: <Settings /> },
        ],
      },
      { path: "video", element: <VideoRoom /> },
    ],
  },
];

export default Router;
