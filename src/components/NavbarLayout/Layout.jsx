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
      {newProjectCreateModalOpen && (
        <div className="w-full h-full flex bg-black bg-opacity-50 z-98 fixed top-16 left-0">
          <CreateProjectModal />
        </div>
      )}
    </div>
  );
};

export default Layout;
