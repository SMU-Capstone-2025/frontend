import { Route } from "react-router-dom";
import App from "../App";
import Main from "../pages/wireframe-main/Main";
import Project from "../pages/wireframe-project/Project";
import VideoRoom from "../pages/wireframe-videoroom/videoRoom";

const Router = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Main /> },
      { path: "project", element: <Project /> },
      { path: "video", element: <VideoRoom /> },
    ],
  },
];

export default Router;
