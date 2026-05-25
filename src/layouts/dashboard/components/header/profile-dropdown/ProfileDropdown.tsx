// ============================================================
// PROFILE DROPDOWN
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";
import type { IHeaderProfile } from "@/utils/interface";

// ===== Styles =====
import styles from "./ProfileDropdown.module.scss";

const cx = classNames.bind(styles);

interface Props {
  profile: IHeaderProfile;
  onLogout: () => void;
}

const ProfileDropdown = ({ profile, onLogout }: Props) => {
  // ===== Hooks =====
  const { t } = useTranslation();
  const { name, avatarLabel } = profile;

  return (
    <div className={cx("profileMenu")}>
      <div className={cx("menuUser")}>
        <div className={cx("menuAvatar")}>{avatarLabel}</div>

        {name && (
          <div className={cx("userInfo")}>
            <span className={cx("userName")}>{name}</span>
          </div>
        )}
      </div>

      <div className={cx("divider")} />

      <button type="button" className={cx("menuItem")}>
        <span className={cx("menuIcon")}>👤</span>
        <span>{t("header.profile")}</span>
      </button>

      <button type="button" className={cx("menuItem")}>
        <span className={cx("menuIcon")}>🔒</span>
        <span>{t("header.change_password")}</span>
      </button>

      <div className={cx("divider")} />

      <button type="button" className={cx("logoutItem")} onClick={onLogout}>
        <span className={cx("menuIcon")}>⏻</span>
        <span>{t("auth.logout")}</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
