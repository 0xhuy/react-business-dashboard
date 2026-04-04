// ===== Libs =====
import { useLocation, useNavigate } from "react-router-dom";

// ===== Routes =====
import { privateRoutes } from "@/router/private.routes";

// ===== Enums =====
import { Role } from "@/utils/enum/role.enum";

// ===== Styles =====
import styles from "./Sidebar.module.scss";

const role = Role.ADMIN;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Dashboard</div>

      <div className={styles.menu}>
        {privateRoutes
          .filter((route) => route.role === role)
          .map((route) => {
            if (!route.name) return null;

            const isActive = location.pathname === route.path;

            return (
              <div
                key={route.path}
                className={isActive ? styles.active : styles.item}
                onClick={() => navigate(route.path)}
              >
                {route.name}
              </div>
            );
          })}
      </div>
    </aside>
  );
};

export default Sidebar;
