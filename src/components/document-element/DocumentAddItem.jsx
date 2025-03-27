import { useState } from "react";
import { Modal } from "../index";
import * as S from "./DocumentAddItem.styled";

const DocumentAddItem = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("기타 문서");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    if (!title.trim()) return;
    const newDocument = {
      id: Date.now(),
      title,
      preview,
      status,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    onAdd(newDocument);
    setTitle("");
    setPreview("");
    setStatus("기타 문서");
    setIsModalOpen(false);
  };

  return (
    <div>
      <S.AddDocumentButton onClick={() => setIsModalOpen(true)}>
        +
      </S.AddDocumentButton>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={() => handleAdd()}
      >
        <h2>새 문서 추가</h2>
        <S.InputField
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 문서 제목 입력..."
        />
        <S.InputField
          type="text"
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          placeholder="문서 설명 입력..."
        />
        <S.SelectField
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="진행 전">진행 전</option>
          <option value="진행 중">진행 중</option>
          <option value="완료">완료</option>
          <option value="기타 문서">기타 문서</option>
        </S.SelectField>
      </Modal>
    </div>
  );
};

export default DocumentAddItem;
