import { NavLink } from "react-router-dom";
import { DocumentIcon, SettingsIcon, WorkBoardIcon } from "../../assets/icons/";

const tabs = [
  { to: "/project/workboard", label: "작업 보드", icon: <WorkBoardIcon /> },
  { to: "/project/document", label: "문서", icon: <DocumentIcon /> },
  { to: "/project/settings", label: "설정", icon: <SettingsIcon /> },
];

const ProjectTabs = () => {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center gap-3 md:gap-6">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-1.5 py-2 text-sm sm:text-base md:text-[20px] font-semibold cursor-pointer text-black no-underline 
            ${isActive ? "opacity-100 border-b-2 md:border-b-4 border-black" : "opacity-30"}`
          }
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default ProjectTabs;
