// ProjectRouter.jsx
import { Route, Routes, useParams } from "react-router-dom";
import WorkBoard from "./workboard-page/WorkBoard";
import Settings from "./settings-page/Settings";
import DocumentMainPage from "./document-page/DocumentMainPage";
import DocumentDetailPage from "./document-page/DocumentDetailPage";

const ProjectRouter = () => {
  const { section } = useParams();

  if (section === "workboard") return <WorkBoard />;
  if (section === "settings") return <Settings />;
  if (section === "document")
    return (
      <Routes>
        <Route index element={<DocumentMainPage />} />
        <Route path=":id" element={<DocumentDetailPage />} />
      </Routes>
    );

  return <div>잘못된 주소입니다</div>;
};

export default ProjectRouter;
