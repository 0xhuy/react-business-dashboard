// ===== Libs =====
import classNames from "classnames/bind";
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
import { icons } from "@/assets";

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

  // ===== Derived =====
  const menuGroups = role ? routeGroupsByRole[role as Role] : [];

  // ===== Render =====
  return (
    <aside className={cx("sidebar")}>
      <div className={cx("formLogo")}>
        <img
          className={cx("logoIcon")}
          src={icons.iconLogo}
          alt={t("auth.login.logo_alt")}
        />

        <h2 className={cx("logoText")}>{t("auth.app_name")}</h2>
      </div>

      <nav className={cx("menu")}>
        {menuGroups.map((group) => {
          return (
            <div key={group.name} className={cx("menuGroup")}>
              {group.menu.map((menu) => {
                if (!menu.name) return null;

                return <MenuItem key={menu.path} menuItem={menu} />;
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
