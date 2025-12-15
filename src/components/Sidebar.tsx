import { NavLink } from "react-router-dom";

const SidebarButton = ({
  to,
  iconSource,
  label,
}: {
  to: string;
  iconSource: string;
  label: string;
}) => {
  return (
    <NavLink className="sidebar-btn" to={to}>
      <img
        className="w-6 h-6"
        src={`/src/assets/icon/${iconSource}`}
        alt={`${label} Button Icon`}
      />
      {label}
    </NavLink>
  );
};

export const Sidebar = () => {
  return (
    <div className="w-fit h-screen flex flex-col gap-4 bg-primary-50 border-r">
      <img className="w-40 h-fit m-4" src="/Icon.svg" alt="Dailyst Logo" />
      <SidebarButton to="/home" iconSource="house.svg" label="Home" />
      <SidebarButton
        to="/journals"
        iconSource="plume-ink.svg"
        label="Journals"
      />
      <SidebarButton to="/todos" iconSource="pin.svg" label="Todos" />
      <SidebarButton to="/goals" iconSource="trophy.svg" label="Goals" />
    </div>
  );
};
