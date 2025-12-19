import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { authService } from "../firebase/services/auth.service";
import { authType } from "../firebase/types/AuthType";

const SidebarButton = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: ReactNode;
  label: string;
}) => {
  return (
    <NavLink className="sidebar-btn flex-1" to={to}>
      <i className={`di di-${icon} text-xl`}></i>
      {label}
    </NavLink>
  );
};
export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-fit flex flex-col bg-primary-50 border-r">
      <img className="w-40 h-fit m-4 mb-8" src="/Icon.svg" alt="Dailyst Logo" />
      <div className="flex flex-col gap-4">
        <SidebarButton to="/home" icon="house" label="Home" />
        <SidebarButton to="/journals" icon="plume-ink" label="Journals" />
        <SidebarButton to="/todos" icon="pin" label="Todos" />
        <SidebarButton to="/goals" icon="trophy" label="Goals" />
      </div>

      <div className="flex flex-col gap-2 mt-auto mb-4">
        {authService.getUserAuthType() === authType.NONE ? (
          <>
            <SidebarButton to="/login" icon="join" label="Login" />
            <SidebarButton to="/join" icon="heart" label="Join" />
          </>
        ) : (
          <button
            className="sidebar-btn flex-1"
            onClick={() => {
              authService.logoutUser();
              navigate("/home");
              navigate(0);
            }}
          >
            <i className={`di di-leave text-xl`}></i>
            Quit
          </button>
        )}
      </div>
    </div>
  );
};
