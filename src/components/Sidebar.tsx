import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { authService } from "../db/firebase/services/auth.service";
import { authType } from "../db/firebase/types/AuthType";

const SidebarButton = ({
  to,
  icon,
  label,
  labelVisible,
}: {
  to: string;
  icon: ReactNode;
  label?: string;
  labelVisible: boolean;
}) => {
  return (
    <NavLink
      className="sidebar-btn flex justify-center items-center gap-2 text-lg rounded-lg p-2 text-text-800 hover:bg-primary-100 transition-colors ease-linear duration-200"
      to={to}
    >
      <i
        className={`di di-${icon} ${!labelVisible ? "text-2xl" : "text-xl"}`}
      ></i>
      {labelVisible && <span className="inline">{label}</span>}
    </NavLink>
  );
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const navigations = [
    { label: "Home", path: "/home", icon: "house" },
    { label: "Journals", path: "/journals", icon: "plume-ink" },
    { label: "Todos", path: "/todos", icon: "pin" },
    { label: "Goals", path: "/goals", icon: "trophy" },
  ];

  const openBurgerMenu = () => {
    setOpen(!open);
    setCollapsed(false);
  };

  useEffect(() => {
    const resizeListener = () => {
      const mobileWidth = 767;
      if (window.innerWidth <= mobileWidth /* Up to Md screens */) {
        setMobile(true);
        setCollapsed(false);
        setOpen(false);
      } else if (window.innerWidth > mobileWidth && window.innerWidth <= 1023) {
        setMobile(false);
        setCollapsed(true);
      } else {
        setMobile(false);
        setCollapsed(false);
      }
    };

    let isResizing = false;
    const minWidth = 80;
    const maxWidth = 320;

    const edgeMoveListener = (e: MouseEvent) => {
      if (!ref.current || isResizing) return;

      const sidebar = ref.current;
      const sidebarRect = sidebar.getBoundingClientRect();
      const sidebarRight = sidebarRect.right;
      const threshold = 5;

      if (Math.abs(e.clientX - sidebarRight) <= threshold) {
        sidebar.style.borderRightColor = "var(--color-primary-300)";
        sidebar.style.borderRightWidth = "3px";
        sidebar.style.cursor = "ew-resize";
        document.body.style.cursor = "ew-resize";
      } else {
        sidebar.style.borderRightColor = "unset";
        sidebar.style.borderRightWidth = "2px";
        sidebar.style.cursor = "initial";
        document.body.style.cursor = "initial";
      }
    };

    const edgeDownListener = (e: MouseEvent) => {
      if (!ref.current) return;

      const sidebar = ref.current;
      const sidebarRect = sidebar.getBoundingClientRect();
      const sidebarRight = sidebarRect.right;
      const threshold = 5;

      if (Math.abs(e.clientX - sidebarRight) <= threshold) {
        isResizing = true;
        e.preventDefault();

        document.body.style.userSelect = "none";
        sidebar.style.transition = "none";
      }
    };

    const edgeDragListener = (e: MouseEvent) => {
      if (!ref.current || !isResizing) return;

      e.preventDefault();
      const sidebar = ref.current;

      let newWidth = e.clientX;

      if (newWidth < minWidth) {
        newWidth = minWidth;
      } else if (newWidth > maxWidth) {
        newWidth = maxWidth;
      }

      sidebar.style.width = `${newWidth}px`;

      if (newWidth < 150) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    const edgeUpListener = () => {
      if (!ref.current || !isResizing) return;

      isResizing = false;

      const sidebar = ref.current;
      sidebar.style.borderRightColor = "unset";
      sidebar.style.borderRightWidth = "2px";
      sidebar.style.cursor = "initial";
      sidebar.style.transition = "";
      document.body.style.cursor = "initial";
      document.body.style.userSelect = "auto";
    };

    const edgeLeaveListener = () => {
      if (!ref.current || isResizing) return;

      const sidebar = ref.current;
      sidebar.style.borderRightColor = "unset";
      sidebar.style.borderRightWidth = "2px";
      sidebar.style.cursor = "initial";
      document.body.style.cursor = "initial";
    };

    const sidebar = ref.current;
    if (sidebar) {
      sidebar.addEventListener("mousemove", edgeMoveListener);
      sidebar.addEventListener("mousedown", edgeDownListener);
      sidebar.addEventListener("mouseleave", edgeLeaveListener);
    }

    document.addEventListener("mousemove", edgeDragListener);
    document.addEventListener("mouseup", edgeUpListener);
    window.addEventListener("resize", resizeListener);

    resizeListener();

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("mousemove", edgeMoveListener);
        sidebar.removeEventListener("mousedown", edgeDownListener);
        sidebar.removeEventListener("mouseleave", edgeLeaveListener);
      }
      document.removeEventListener("mousemove", edgeDragListener);
      document.removeEventListener("mouseup", edgeUpListener);
      window.removeEventListener("resize", resizeListener);

      document.body.style.cursor = "initial";
      document.body.style.userSelect = "auto";
    };
  }, []);

  useEffect(() => {
    const setSidebarOpen = () => {
      setOpen(false);
    };
    if (mobile) {
      setSidebarOpen();
    }
  }, [location.pathname, mobile]);

  return (
    <>
      {mobile && (
        <>
          <button
            onClick={() => openBurgerMenu()}
            className="fixed z-9 top-2 right-2 flex items-center justify-center p-2 px-3 cursor-pointer bg-background-100 text-text-800 border-2 hover:bg-background-200 transition-all"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-1 w-full bg-text-800 transition-all duration-300 ${
                  mobile && open ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-1 w-full bg-text-800 transition-all duration-300 ${
                  mobile && open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-1 w-full bg-text-800 transition-all duration-300 ${
                  mobile && open ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </>
      )}

      {mobile && open && (
        <div
          className="fixed inset-0 bg-background-900/50 z-10 lg:hidden transition-all duration-300"
          onClick={() => openBurgerMenu()}
        />
      )}

      <div
        ref={ref}
        className={`${
          !mobile
            ? "translate-x-0 border-r-2"
            : open
            ? "fixed top-0 right-0 translate-x-0 pt-10 min-w-30 w-30 h-full"
            : "fixed top-0 right-0 translate-x-500"
        } flex flex-col w-20 sm:max-w-25 lg:w-52 lg:max-w-80 bg-primary-50 border-l-2 z-10 transition-all duration-300 ease-in-out`}
      >
        {!collapsed && !mobile && (
          <img
            className="self-center w-fit h-fit m-4"
            src="/Icon.svg"
            alt="Dailyst Logo"
          />
        )}

        <nav className="flex flex-col justify-between flex-1 p-2">
          <ul className="space-y-2">
            {navigations.map((navigation) => {
              return (
                <li key={navigation.path}>
                  <SidebarButton
                    to={navigation.path}
                    icon={navigation.icon}
                    label={navigation.label}
                    labelVisible={!collapsed || mobile}
                  />
                </li>
              );
            })}
          </ul>

          <ul className="space-y-2 mt-2 mb-4">
            {authService.getUserAuthType() === authType.NONE ? (
              <>
                <SidebarButton
                  to="/login"
                  icon="join"
                  label={!collapsed ? "Login" : ""}
                  labelVisible={!collapsed || mobile}
                />
                <SidebarButton
                  to="/join"
                  icon="heart"
                  label={!collapsed ? "Join" : ""}
                  labelVisible={!collapsed || mobile}
                />
              </>
            ) : (
              <button
                className="flex justify-center items-center gap-2 text-xl rounded-lg p-2 text-text-800 hover:bg-primary-100 transition duration-200 active:bg-primary-200 active:font-semibold active:text-primary-500"
                onClick={() => {
                  authService.logoutUser();
                  navigate("/home");
                  navigate(0);
                }}
              >
                <i className="di di-leave text-xl"></i>
                {collapsed ||
                  (mobile && <span className="md:inline">Quit</span>)}
              </button>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};
