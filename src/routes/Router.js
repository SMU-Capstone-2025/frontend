import Project from "../pages/wireframe-project/Project";
import VideoRoom from "../pages/wireframe-videoroom/VideoRoom";
import RootLayout from "../layout/root-layout";
import DoctalkMain from "../pages/doctalkMain/DoctalkMain";
import Login from "../pages/login/Login";
import Signup from "../pages/Signup/Signup";
import Mypage from "../pages/Mypage/Mypage";
import PasswordReset from "../pages/PasswordReset/PasswordReset";
import ProjectRouter from "../pages/wireframe-project/ProjectRouter";
import VideoConference from "../components/VideoConference";
import DocumentCreatePage from "../pages/wireframe-project/document-page/DocumentCreatePage";

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
      { path: "video-call", element: <VideoConference /> },

      {
        path: "project/:section/:projectId/*",
        element: <Project />,
        children: [
          {
            path: "*",
            element: <ProjectRouter />,
          },
        ],
      },

      { path: "video", element: <VideoRoom /> },
      // 문서 생성
      {
        path: "/document/new/:projectId",
        element: <DocumentCreatePage />,
      },

      // 문서 상세
      {
        path: "/document/:documentId",
        element: <DocumentCreatePage />,
      },
    ],
  },
];

export default Router;
