// ===== Libs =====
import classNames from "classnames/bind";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// ===== Redux =====
import { useAppSelector } from "@/redux/hooks";

// ===== Routes =====
import {
  privateAdminRouteGroups,
  privateStaffRouteGroups,
  privateViewerRouteGroups,
} from "@/router/private.routes";
import { getRedirectByRole } from "@/router/redirect";

// ===== Enums =====
import { Role } from "@/utils/enum";

// ===== Components =====
import MenuItem from "./menu-item/MenuItem";

// ===== Assets =====
import { IconArrow, icons } from "@/assets";
import {
  SIDEBAR_COLLAPSED_STORAGE_KEY,
  TABLET_VIEWPORT_QUERY,
} from "@/utils/constants";
import { WHITE } from "@/utils/constants/color";

// ===== Styles =====
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

// ===== Constants =====
const routeGroupsByRole = {
  [Role.ADMIN]: privateAdminRouteGroups,
  [Role.STAFF]: privateStaffRouteGroups,
  [Role.VIEWER]: privateViewerRouteGroups,
};

// ===== Component =====
const Sidebar = () => {
  // ===== Hooks =====
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ===== Redux =====
  const role = useAppSelector((state) => state.auth.role);

  // ===== States =====
  const [isCollapsed, setIsCollapsed] = useState(
    () => window.matchMedia(TABLET_VIEWPORT_QUERY).matches ||
      localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === String(true),
  );
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia(TABLET_VIEWPORT_QUERY).matches,
  );

  // ===== Effects =====
  useEffect(() => {
    const mediaQuery = window.matchMedia(TABLET_VIEWPORT_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);

      if (event.matches) setIsCollapsed(true);
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobile || isCollapsed) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setIsCollapsed(true);
      localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(true));
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCollapsed, isMobile]);

  // ===== Derived =====
  const menuGroups = role ? routeGroupsByRole[role as Role] : [];

  // ===== Handlers =====
  const handleToggleSidebar = () => {
    setIsCollapsed((currentValue) => {
      const nextValue = !currentValue;
      localStorage.setItem(
        SIDEBAR_COLLAPSED_STORAGE_KEY,
        String(nextValue),
      );
      return nextValue;
    });
  };

  const handleExpandSidebar = () => {
    setIsCollapsed(false);
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(false));
  };

  const handleCollapseSidebar = () => {
    if (!isMobile) return;

    setIsCollapsed(true);
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(true));
  };

  const handleLogoClick = () => {
    if (!role) return;

    navigate(getRedirectByRole(role as Role));
    handleCollapseSidebar();
  };

  // ===== Render =====
  return (
    <Fragment>
      {isMobile && !isCollapsed && (
        <button
          type="button"
          className={cx("backdrop")}
          aria-label={t("common.sidebar_collapse")}
          onClick={handleCollapseSidebar}
        />
      )}

      <aside className={cx("sidebar", { collapsed: isCollapsed })}>
      <button
        type="button"
        className={cx("toggleButton", { toggleButtonCollapsed: isCollapsed })}
        aria-label={
          isCollapsed
            ? t("common.sidebar_expand")
            : t("common.sidebar_collapse")
        }
        title={
          isCollapsed
            ? t("common.sidebar_expand")
            : t("common.sidebar_collapse")
        }
        onClick={handleToggleSidebar}
      >
        <IconArrow width={14} height={14} strokePath={WHITE} />
      </button>

      <button
        type="button"
        className={cx("formLogo")}
        aria-label={t("sidebar.dashboard")}
        onClick={handleLogoClick}
      >
        <img
          className={cx("logoIcon")}
          src={icons.iconLogo}
          alt={t("auth.login.logo_alt")}
        />

        {!isCollapsed && (
          <p className={cx("logoText")}>{t("auth.app_name")}</p>
        )}
      </button>

      <nav className={cx("menu")}>
        {menuGroups.map((group) => {
          return (
            <div key={group.name} className={cx("menuGroup")}>
              {group.menu.map((menu) => {
                if (!menu.name) return null;

                return (
                  <MenuItem
                    key={menu.path}
                    menuItem={menu}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpandSidebar}
                    onNavigate={handleCollapseSidebar}
                  />
                );
              })}
            </div>
          );
        })}
      </nav>
      </aside>
    </Fragment>
  );
};

export default Sidebar;
