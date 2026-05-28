// ============================================================
// MAIN LAYOUT
// ============================================================

// ===== Libs =====
import { Outlet } from "react-router-dom";

// ===== Components =====
import { Sidebar, Header } from "./components";

// ===== Styles =====
import styles from "./MainLayout.module.scss";

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.main}>
        <Header />

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
