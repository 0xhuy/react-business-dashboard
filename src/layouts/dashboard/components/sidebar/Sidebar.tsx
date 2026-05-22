// ===== Libs =====
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/redux/hooks";

// ===== Routes =====
import {
  privateAdminRoutes,
  privateStaffRoutes,
  privateViewerRoutes,
} from "@/router/private.routes";

// ===== Enums =====
import { Role } from "@/utils/enum/role.enum";

// ===== Styles =====
import styles from "./Sidebar.module.scss";

// ===== Constants =====
const routesByRole = {
  [Role.ADMIN]: privateAdminRoutes,
  [Role.STAFF]: privateStaffRoutes,
  [Role.VIEWER]: privateViewerRoutes,
};

// ===== Component =====
const Sidebar = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const role = useAppSelector((state) => state.auth.role);

  // ===== Derived =====
  const menuRoutes = role ? routesByRole[role as Role] : [];

  // ===== Render =====
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Dashboard</div>

      <div className={styles.menu}>
        {menuRoutes.map((route) => {
          if (!route.name) return null;

          const isActive = location.pathname === route.path;

          return (
            <div
              key={route.path}
              className={isActive ? styles.active : styles.item}
              onClick={() => navigate(route.path)}
            >
              {t(route.name)}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
