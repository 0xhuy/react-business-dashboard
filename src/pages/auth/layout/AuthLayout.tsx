// ============================================================
// AUTH LAYOUT
// ============================================================

// ===== Libs =====
import type { ReactNode } from "react";
import classNames from "classnames/bind";

// ===== Components, Layouts, Pages =====
import { LanguageSwitcher } from "@/components/common/language-switcher";

// ===== Styles =====
import styles from "./AuthLayout.module.scss";

const cx = classNames.bind(styles);

// ===== Types =====
type AuthLayoutProps = {
  children: ReactNode;
};

// ===== Component =====
const AuthLayout = ({ children }: AuthLayoutProps) => {
  // ===== Render =====
  return (
    <div className={cx("authLayout")}>
      <div className={cx("languageSwitcherWrapper")}>
        <LanguageSwitcher />
      </div>

      {children}
    </div>
  );
};

export default AuthLayout;
