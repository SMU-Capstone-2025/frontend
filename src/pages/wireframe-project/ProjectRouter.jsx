// ProjectRouter.jsx
import { useParams } from "react-router-dom";
import WorkBoard from "./workboard-page/WorkBoard";
import Settings from "./settings-page/Settings";
import DocumentMainPage from "./document-page/DocumentMainPage";

const ProjectRouter = () => {
  const { section } = useParams();

  if (section === "workboard") return <WorkBoard />;
  if (section === "settings") return <Settings />;
  if (section === "document") return <DocumentMainPage />;

  return <div>잘못된 주소입니다</div>;
};

export default ProjectRouter;
