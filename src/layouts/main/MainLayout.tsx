// ============================================================
// MAIN LAYOUT
// ============================================================

// ===== Libs =====
import { Outlet } from "react-router-dom";
import classNames from "classnames/bind";

// ===== Components =====
import { Sidebar, Header } from "./components";

// ===== Styles =====
import styles from "./MainLayout.module.scss";
const cx = classNames.bind(styles);

const MainLayout = () => {
  return (
    <div className={cx("layout")}>
      <Sidebar />

      <div className={cx("main")}>
        <Header />

        <div className={cx("content")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
