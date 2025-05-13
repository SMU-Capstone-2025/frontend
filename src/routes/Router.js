import { Navigate } from "react-router-dom";
import Project from "../pages/wireframe-project/Project";
import VideoRoom from "../pages/wireframe-videoroom/VideoRoom";
import RootLayout from "../layout/root-layout";
import DoctalkMain from "../pages/doctalkMain/DoctalkMain";
import DocumentDetailPage from "../pages/wireframe-project/document-page/DocumentDetailPage";
import Settings from "../pages/wireframe-project/settings-page/Settings";
import WorkBoard from "../pages/wireframe-project/workboard-page/WorkBoard";
import Document from "../pages/wireframe-project/document-page/Document";
import Login from "../pages/login/Login";
import Signup from "../pages/Signup/Signup";
import DocumentCreatePage from "../pages/wireframe-project/document-page/DocumentCreatePage";
import DocumentMainPage from "../pages/wireframe-project/document-page/DocumentMainPage";

const Router = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DoctalkMain /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      {
        path: "project",
        element: <Project />,
        children: [
          { index: true, element: <Navigate to="workboard" /> },
          { path: "workboard", element: <WorkBoard /> },
          {
            path: "document",
            element: <Document />,
            children: [
              { index: true, element: <DocumentMainPage /> },
              { path: ":id", element: <DocumentDetailPage /> },
            ],
          },

          { path: "settings", element: <Settings /> },
        ],
      },
      { path: "video", element: <VideoRoom /> },
      { path: "project/document/new", element: <DocumentCreatePage /> },
    ],
  },
];

export default Router;
