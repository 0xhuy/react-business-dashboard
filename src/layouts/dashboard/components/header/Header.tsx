// ============================================================
// DASHBOARD HEADER
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ===== Others =====
import { authRouteAbsolute, EMPTY_STRING } from "@/utils/constants";
import { logoutAuthThunk } from "@/redux/thunks/auth/authThunk";
import { useAppDispatch, useAuth } from "@/redux/hooks";
import ProfileDropdown from "./profile-dropdown/ProfileDropdown";

// ===== Styles, Images, Icons =====
import styles from "./Header.module.scss";
import { icons } from "@/assets";

const cx = classNames.bind(styles);

const Header = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { t } = useTranslation();

  // ===== States =====
  const [isOpenProfileMenu, setIsOpenProfileMenu] = useState(false);

  // ===== Handlers =====
  const handleToggleProfileMenu = () => {
    setIsOpenProfileMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    await dispatch(logoutAuthThunk());
    navigate(authRouteAbsolute.login);
  };

  // ===== Variables =====
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    EMPTY_STRING;

  const avatarLabel = userName
    ? userName.charAt(0).toUpperCase()
    : EMPTY_STRING;

  const profile = {
    name: userName,
    avatarLabel,
  };

  // ===== Render =====
  return (
    <header className={cx("header")}>
      <div className={cx("left")}></div>

      <div className={cx("right")}>
        <button type="button" className={cx("iconButton")}>
          🔔
        </button>

        <div className={cx("profileWrap")}>
          <button
            type="button"
            className={cx("profileButton")}
            onClick={handleToggleProfileMenu}
          >
            <span className={cx("avatar")}>{avatarLabel}</span>

            {userName && (
              <div className={cx("userInfo")}>
                <span className={cx("userName")}>{userName}</span>
              </div>
            )}

            <span className={cx("arrow")}>
              <img
                className={cx("iconDropdownHeader")}
                src={icons.iconDropdownHeader}
                alt={t("common.dropdown")}
              />
            </span>
          </button>

          {isOpenProfileMenu && (
            <ProfileDropdown profile={profile} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
