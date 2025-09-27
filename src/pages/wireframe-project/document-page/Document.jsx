import { Outlet } from "react-router-dom";

const Document = () => {
  return (
    <div className="w-full min-h-screen">
      <Outlet />
    </div>
  );
};

export default Document;
