// 📁 pages/wireframe-project/document-page/DocumentCreatePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentEditor from "../../../hooks/useDocumentEditor";
import { EditorContent } from "@tiptap/react";
import EditNavbar from "../../../components/document-element/create/edit-navbar/EditNavbar";
import { createDocument } from "../../../api/documentApi";

const DocumentCreatePage = () => {
  const navigate = useNavigate();
  const editor = useDocumentEditor();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editor) {
      console.log("에디터 초기화");
    }
  }, [editor]); // editor 실행 시 콘솔에 임시 출력

  const handleAutoSaveAndBack = async () => {
    if (!editor || editor.getHTML().trim() === "") return;

    const newDoc = {
      title: title.trim() || "제목 없음", // 추후 제목 필드 추가 시 대체
      content: editor.getHTML(),
      status: "기타 문서",
    };

    try {
      setIsLoading(true);
      await createDocument(newDoc);
      navigate("/project/document");
    } catch (error) {
      alert("문서 저장 중 오류 발생: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 w-[1920px] h-[1080px]">
      <EditNavbar
        title={title}
        onTitleChange={setTitle}
        onBack={handleAutoSaveAndBack}
        editor={editor}
      />
      <div className="flex w-[1920px] h-[929px] justify-start items-start shrink-0 bg-white">
        {isLoading ? (
          <div className="text-gray-400 p-6">문서 저장 중...</div>
        ) : (
          <EditorContent
            editor={editor}
            className="w-full h-full overflow-y-auto p-4"
          />
        )}
      </div>
    </div>
  );
};

export default DocumentCreatePage;
