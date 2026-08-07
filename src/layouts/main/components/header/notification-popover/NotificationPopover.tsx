// ============================================================
// NOTIFICATION POPOVER
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// ===== Components, Images, Icons =====
import { IconNotification } from "@/assets";
import { BaseButton } from "@/components";

// ===== Others =====
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_TYPE,
} from "@/utils/constants";
import type {
  NotificationItem,
  NotificationPopoverProps,
  NotificationType,
} from "./types";

// ===== Styles =====
import styles from "./NotificationPopover.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const NotificationPopover = ({
  isOpen,
  onUnreadCountChange,
}: NotificationPopoverProps) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    MOCK_NOTIFICATIONS.map((notification) => ({ ...notification })),
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [onUnreadCountChange, unreadCount]);

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NOTIFICATION_TYPE.ORDER:
        return t("notification.type_order");
      case NOTIFICATION_TYPE.STOCK:
        return t("notification.type_stock");
      default:
        return t("notification.type_system");
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cx("popover")}
      role="dialog"
      aria-label={t("notification.title")}
    >
      <div className={cx("header")}>
        <div>
          <p className={cx("title")}>{t("notification.title")}</p>
          <p className={cx("summary")}>{t("notification.recent")}</p>
        </div>
        <span className={cx("unreadCount")}>
          {t("notification.unread_count", { count: unreadCount })}
        </span>
      </div>

      <div className={cx("list")}>
        {notifications.map((notification) => (
          <button
            type="button"
            key={notification.id}
            className={cx("item", {
              unread: !notification.isRead,
            })}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            <span
              className={cx("icon", `icon-${notification.type}`)}
              aria-hidden="true"
            >
              <IconNotification />
            </span>

            <span className={cx("content")}>
              <span className={cx("itemHeader")}>
                <span className={cx("itemTitle")}>
                  {t(notification.titleKey)}
                </span>
                {!notification.isRead && (
                  <span className={cx("unreadDot")} />
                )}
              </span>
              <span className={cx("description")}>
                {t(notification.descriptionKey)}
              </span>
              <span className={cx("meta")}>
                {getTypeLabel(notification.type)}
                <span aria-hidden="true">•</span>
                {t(notification.timeKey, { count: notification.timeValue })}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className={cx("footer")}>
        <BaseButton
          isStatic
          isDisabled={unreadCount === 0}
          className={cx("markAllButton")}
          onClick={handleMarkAllAsRead}
        >
          {t("notification.mark_all_as_read")}
        </BaseButton>
      </div>
    </div>
  );
};

export default NotificationPopover;
