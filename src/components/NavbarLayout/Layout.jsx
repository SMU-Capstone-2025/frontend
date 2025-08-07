import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import CreateProjectModal from "../CreateProjectModal/CreateProjectModal";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newProjectCreateModalOpen, setNewProjectCreateModalOpen] =
    useState(false);
  const handleSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("Sidebar toggled:", sidebarOpen);
  };

  return (
    <>
      {newProjectCreateModalOpen && (
        <div
          className="fixed inset-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[99] "
          onClick={() =>
            setNewProjectCreateModalOpen(!newProjectCreateModalOpen)
          }
        >
          <div className="z-[100] relative">
            <CreateProjectModal
              newProjectCreateModalOpen={newProjectCreateModalOpen}
              setNewProjectCreateModalOpen={setNewProjectCreateModalOpen}
            />
          </div>
        </div>
      )}
      <div className="relative w-full min-h-screen bg-gray-50">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {sidebarOpen && (
          <>
            <div className="fixed top-16 left-0 z-50">
              <Sidebar
                newProjectCreateModalOpen={newProjectCreateModalOpen}
                setNewProjectCreateModalOpen={setNewProjectCreateModalOpen}
              />
            </div>
            <div
              className="fixed top-16 left-0 w-full h-[calc(100%-64px)] bg-black bg-opacity-50 z-40 cursor-pointer"
              onClick={handleSidebarOpen}
            />
          </>
        )}

        <main className="pt-16 flex flex-col items-center z-10 relative">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;

// TailwindCSS에서 inset-0은 다음과 같습니다:
// inset-0 => top: 0; right: 0; bottom: 0; left: 0;
// 즉, 요소를 화면 전체(부모 기준)로 확장합니다.
// fixed와 함께 사용하면 전체 화면을 덮는 오버레이가 됩니다.
