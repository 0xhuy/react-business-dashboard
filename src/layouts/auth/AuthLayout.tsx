// ============================================================
// AUTH LAYOUT
// ============================================================

// ===== Libs =====
import type { ReactNode } from "react";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Components, Layouts, Pages =====
import { LanguageSwitcher } from "@/components/common/language-switcher";

// ===== Styles, Images, Icons =====
import { icons, images } from "@/assets";
import styles from "./AuthLayout.module.scss";

const cx = classNames.bind(styles);

// ===== Types =====
type AuthLayoutProps = {
  children: ReactNode;
};

// ===== Component =====
const AuthLayout = ({ children }: AuthLayoutProps) => {
  // ===== Hooks =====
  const { t } = useTranslation();

  // ===== Render =====
  return (
    <div className={cx("authLayout")}>
      <div className={cx("container")}>
        <div className={cx("card")}>
          <div className={cx("languageSwitcherWrapper")}>
            <LanguageSwitcher />
          </div>
          <div className={cx("imagePanel")}>
            <img
              src={images.authIllustrationDashboard}
              alt={t("auth.login.dashboard_alt")}
              className={cx("mainIllustration")}
            />
            <img
              src={images.authIllustrationWidgets}
              alt={t("auth.login.widgets_alt")}
              className={cx("widgetOverlay")}
            />

            <div className={cx("logoBadge")}>
              <div className={cx("formLogo")}>
                <img
                  className={cx("logoIcon")}
                  src={icons.iconLogo}
                  alt={t("auth.login.logo_alt")}
                />
                <h2 className={cx("logoText")}>{t("auth.app_name")}</h2>
              </div>
            </div>
          </div>

          <div className={cx("formPanel")}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
