import Project from "../pages/wireframe-project/Project";
import VideoRoom from "../pages/wireframe-videoroom/VideoRoom";
import RootLayout from "../layout/root-layout";
import DoctalkMain from "../pages/doctalkMain/DoctalkMain";
import Login from "../pages/login/Login";
import Signup from "../pages/Signup/Signup";
import Mypage from "../pages/Mypage/Mypage";
import DocumentCreatePage from "../pages/wireframe-project/document-page/DocumentCreatePage";
import PasswordReset from "../pages/PasswordReset/PasswordReset";
import ProjectRouter from "../pages/wireframe-project/ProjectRouter";

const Router = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DoctalkMain /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "mypage", element: <Mypage /> },
      { path: "password-reset", element: <PasswordReset /> },

      {
        path: "project/:section/:projectId",
        element: <Project />,
        children: [
          {
            path: "",
            element: <ProjectRouter />,
          },
        ],
      },

      { path: "project/document/new", element: <DocumentCreatePage /> },

      { path: "video", element: <VideoRoom /> },
    ],
  },
];

export default Router;
