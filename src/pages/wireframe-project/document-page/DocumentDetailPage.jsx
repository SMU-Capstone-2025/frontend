import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const [document, setDocument] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  // ✨ 추후 문서 데이터 fetch or context 연결 가능

  return (
    <div className="max-w-[1042px] mx-auto px-6 py-8 bg-white rounded-xl shadow border border-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">문서 상세: {id}</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-200"
        >
          뒤로가기
        </button>
      </div>

      <div className="text-gray-500">
        여기에 문서 내용을 렌더링할 수 있습니다.
      </div>
    </div>
  );
};

export default DocumentDetailPage;
