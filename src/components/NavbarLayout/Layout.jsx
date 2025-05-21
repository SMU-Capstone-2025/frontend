import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("Sidebar toggled:", sidebarOpen);
  };

  return (
    <div className="relative flex flex-col justify-start items-center w-full h-full min-h-screen bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div className="flex w-full h-full">
          <Sidebar />
          <div
            className="w-full h-full bg-black bg-opacity-50 relative z-40 cursor-pointer"
            onClick={handleSidebarOpen}
          />
        </div>
      )}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
