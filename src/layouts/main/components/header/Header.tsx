// ============================================================
// DASHBOARD HEADER
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ===== Components, Images, Icons =====
import { icons, IconNotification } from "@/assets";
import { BaseTooltip } from "@/components";
import NotificationPopover from "./notification-popover";
import ProfileDropdown from "./profile-dropdown/ProfileDropdown";

// ===== Others =====
import {
  authRouteAbsolute,
  EMPTY_STRING,
  NOTIFICATION_BADGE_MAX_COUNT,
  SETTINGS_ROUTE_BY_ROLE,
  SETTINGS_SECTION,
} from "@/utils/constants";
import { logoutAuthThunk } from "@/redux/thunks/auth/authThunk";
import { useAppDispatch, useAuth, useNotifications } from "@/redux/hooks";
import useNotificationSubscription from "@/features/notifications/hooks/useNotificationSubscription";
import type { SettingsSection } from "@/features/settings/settings.types";

// ===== Styles =====
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

const Header = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, role } = useAuth();
  const { notifications } = useNotifications();
  const { t } = useTranslation();
  const canViewNotifications = useNotificationSubscription(user?.id, role);

  // ===== States =====
  const [isOpenProfileMenu, setIsOpenProfileMenu] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // ===== Effects =====
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideProfileMenu =
        !profileMenuRef.current?.contains(target);
      const isOutsideNotification =
        !notificationRef.current?.contains(target);

      if (isOutsideProfileMenu && isOutsideNotification) {
        setIsOpenProfileMenu(false);
        setIsOpenNotification(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpenProfileMenu(false);
        setIsOpenNotification(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ===== Handlers =====
  const handleToggleProfileMenu = () => {
    setIsOpenNotification(false);
    setIsOpenProfileMenu((prev) => !prev);
  };

  const handleToggleNotification = () => {
    setIsOpenProfileMenu(false);
    setIsOpenNotification((isOpen) => !isOpen);
  };

  const handleLogout = async () => {
    setIsOpenProfileMenu(false);
    await dispatch(logoutAuthThunk());
    navigate(authRouteAbsolute.login);
  };

  const handleOpenSettingsSection = (section: SettingsSection) => {
    if (!role) return;

    const settingsRoute = SETTINGS_ROUTE_BY_ROLE[role];
    if (!settingsRoute) return;

    setIsOpenProfileMenu(false);
    navigate(`${settingsRoute}#${section}`);
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

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const notificationBadgeText =
    unreadNotificationCount > NOTIFICATION_BADGE_MAX_COUNT
      ? `${NOTIFICATION_BADGE_MAX_COUNT}+`
      : String(unreadNotificationCount);

  // ===== Render =====
  return (
    <header className={cx("header")}>
      <div className={cx("left")}></div>

      <div className={cx("right")}>
        {canViewNotifications && (
          <div className={cx("notificationWrap")} ref={notificationRef}>
            <button
              type="button"
              className={cx("iconButton")}
              aria-label={t("settings.notifications_title")}
              aria-expanded={isOpenNotification}
              data-tooltip-id="header-action-tooltip"
              data-tooltip-content={t("settings.notifications_title")}
              onClick={handleToggleNotification}
            >
              <IconNotification />
              {unreadNotificationCount > 0 && (
                <span className={cx("notificationBadge")} aria-hidden="true">
                  {notificationBadgeText}
                </span>
              )}
            </button>

            <NotificationPopover
              isOpen={isOpenNotification}
              onClose={() => setIsOpenNotification(false)}
            />
          </div>
        )}

        <div className={cx("profileWrap")} ref={profileMenuRef}>
          <button
            type="button"
            className={cx("profileButton")}
            aria-label={t("header.profile")}
            aria-expanded={isOpenProfileMenu}
            data-tooltip-id="header-action-tooltip"
            data-tooltip-content={t("header.profile")}
            onClick={handleToggleProfileMenu}
          >
            <span className={cx("avatar")}>{avatarLabel}</span>

            {userName && (
              <div className={cx("userInfo")}>
                <span
                  className={cx("userName")}
                  tabIndex={0}
                  data-tooltip-id="header-profile-tooltip"
                  onMouseEnter={(event) => {
                    const element = event.currentTarget;
                    if (element.scrollWidth > element.clientWidth) {
                      element.setAttribute("data-tooltip-content", userName);
                    }
                  }}
                  onFocus={(event) => {
                    const element = event.currentTarget;
                    if (element.scrollWidth > element.clientWidth) {
                      element.setAttribute("data-tooltip-content", userName);
                    }
                  }}
                >
                  {userName}
                </span>
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
            <ProfileDropdown
              profile={profile}
              onOpenProfile={() =>
                handleOpenSettingsSection(SETTINGS_SECTION.PROFILE)
              }
              onOpenChangePassword={() =>
                handleOpenSettingsSection(SETTINGS_SECTION.SECURITY)
              }
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>

      <BaseTooltip
        id="header-action-tooltip"
        place="bottom"
        delayShow={80}
        isCompact
      />

      <BaseTooltip
        id="header-profile-tooltip"
        place="bottom"
        delayShow={250}
      />
    </header>
  );
};

export default Header;
