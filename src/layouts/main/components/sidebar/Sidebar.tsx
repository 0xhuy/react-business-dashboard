// ===== Libs =====
import classNames from "classnames/bind";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// ===== Redux =====
import { useAppSelector } from "@/redux/hooks";

// ===== Routes =====
import {
  privateAdminRouteGroups,
  privateStaffRouteGroups,
  privateViewerRouteGroups,
} from "@/router/private.routes";

// ===== Enums =====
import { Role } from "@/utils/enum";

// ===== Components =====
import MenuItem from "./menu-item/MenuItem";

// ===== Assets =====
import { IconArrow, icons } from "@/assets";
import { SIDEBAR_COLLAPSED_STORAGE_KEY } from "@/utils/constants";
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

  // ===== Redux =====
  const role = useAppSelector((state) => state.auth.role);

  // ===== States =====
  const [isCollapsed, setIsCollapsed] = useState(
    () =>
      localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === String(true),
  );

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

  // ===== Render =====
  return (
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
        <IconArrow width={18} height={18} strokePath={WHITE} />
      </button>

      <div className={cx("formLogo")}>
        <img
          className={cx("logoIcon")}
          src={icons.iconLogo}
          alt={t("auth.login.logo_alt")}
        />

        {!isCollapsed && (
          <p className={cx("logoText")}>{t("auth.app_name")}</p>
        )}
      </div>

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
                  />
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
