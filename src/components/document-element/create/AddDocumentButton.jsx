import { useNavigate } from "react-router-dom";
import PlusOn from "../../../assets/icons/Plus/PlusOn";

const AddDocumentButton = ({ projectId }) => {
  const navigate = useNavigate();

  return (
    <button
      className="fixed bottom-8 right-8 lg:bottom-10 lg:right-10 flex w-14 h-14 items-center justify-center text-3xl px-4 py-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition z-50"
      onClick={() => navigate(`/document/new/${projectId}`)}
    >
      <PlusOn />
    </button>
  );
};

export default AddDocumentButton;
