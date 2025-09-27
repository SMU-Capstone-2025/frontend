import useDoclist from "../../../hooks/useDoclist";
import DocumentControl from "../../../components/document-element/common/DocumentControl";
import DocumentList from "../../../components/document-element/common/DocumentList";
import AddDocumentButton from "../../../components/document-element/create/AddDocumentButton";
import { useOutletContext } from "react-router-dom";

const DocumentMainPage = () => {
  const { projectId } = useOutletContext();
  const {
    searchItem,
    setSearchItem,
    filteredDocuments,
    isLoading,
    error,
    addDocument,
    removeDocument,
    setDocuments,
  } = useDoclist(projectId);

  return (
    <div className="flex w-full max-w-[1280px] items-start flex-col gap-8 px-6 py-8 rounded-xl border border-gray-200 bg-white">
      {isLoading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <DocumentControl value={searchItem} onChange={setSearchItem} />
      <DocumentList
        documents={filteredDocuments}
        onDelete={removeDocument}
        projectId={projectId}
        setDocuments={setDocuments}
      />
      <AddDocumentButton projectId={projectId} onAdd={addDocument} />
    </div>
  );
};

export default DocumentMainPage;
