// ============================================================
// NOTIFICATION POPOVER
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// ===== Components, Images, Icons =====
import { IconClose, IconNotification } from "@/assets";
import { BaseButton, BaseLoading } from "@/components";

// ===== Others =====
import {
  formatNotificationTime,
  getNotificationDateGroup,
} from "@/features/notifications/notification.helpers";
import type {
  NotificationFilter,
  NotificationType,
} from "@/features/notifications/notification.types";
import { useAppDispatch, useAuth, useNotifications } from "@/redux/hooks";
import {
  deleteNotificationThunk,
  markAllNotificationsAsReadThunk,
  markNotificationAsReadThunk,
} from "@/redux/thunks/notifications/notificationThunk";
import {
  NOTIFICATION_FILTER,
  NOTIFICATION_INITIAL_VISIBLE_COUNT,
  NOTIFICATION_LOAD_MORE_COUNT,
  NOTIFICATION_TIME_REFRESH_INTERVAL,
  NOTIFICATION_TYPE,
} from "@/utils/constants";
import type { NotificationPopoverProps } from "./types";

// ===== Styles =====
import styles from "./NotificationPopover.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const NotificationPopover = ({
  isOpen,
  onClose,
}: NotificationPopoverProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const {
    notifications,
    loading: isLoading,
    processingNotificationId,
    isMarkingAllAsRead,
    error,
  } = useNotifications();
  const [currentTime, setCurrentTime] = useState(0);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>(
    NOTIFICATION_FILTER.ALL,
  );
  const [visibleCount, setVisibleCount] = useState(
    NOTIFICATION_INITIAL_VISIBLE_COUNT,
  );

  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = window.setTimeout(() => {
      setCurrentTime(Date.now());
    }, 0);
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, NOTIFICATION_TIME_REFRESH_INTERVAL);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;
  const filteredNotifications =
    activeFilter === NOTIFICATION_FILTER.UNREAD
      ? notifications.filter((notification) => !notification.isRead)
      : notifications;
  const visibleNotifications = filteredNotifications.slice(0, visibleCount);
  const hasMoreNotifications =
    visibleCount < filteredNotifications.length;

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

  const handleNotificationClick = async (notificationId: string) => {
    const notification = notifications.find(
      (currentNotification) => currentNotification.id === notificationId,
    );

    if (!notification || !user?.id) return;

    if (!notification.isRead) {
      await dispatch(
        markNotificationAsReadThunk({ notificationId, userId: user.id }),
      );
    }

    if (notification.actionPath) {
      onClose();
      navigate(notification.actionPath);
    }
  };

  const handleMarkAllAsRead = () => {
    if (!user?.id) return;

    void dispatch(markAllNotificationsAsReadThunk(user.id));
  };

  const handleFilterChange = (filter: NotificationFilter) => {
    setActiveFilter(filter);
    setVisibleCount(NOTIFICATION_INITIAL_VISIBLE_COUNT);
  };

  const handleLoadMore = () => {
    setVisibleCount(
      (currentCount) => currentCount + NOTIFICATION_LOAD_MORE_COUNT,
    );
  };

  const handleDeleteNotification = (
    event: MouseEvent<HTMLButtonElement>,
    notificationId: string,
  ) => {
    event.stopPropagation();
    if (!user?.id) return;

    void dispatch(
      deleteNotificationThunk({ notificationId, userId: user.id }),
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
        <p className={cx("title")}>{t("notification.title")}</p>
        <span className={cx("unreadCount")}>
          {t("notification.unread_count", { count: unreadCount })}
        </span>
      </div>

      <div className={cx("tabs")} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === NOTIFICATION_FILTER.ALL}
          className={cx("tab", {
            tabActive: activeFilter === NOTIFICATION_FILTER.ALL,
          })}
          onClick={() => handleFilterChange(NOTIFICATION_FILTER.ALL)}
        >
          {t("notification.filter_all")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === NOTIFICATION_FILTER.UNREAD}
          className={cx("tab", {
            tabActive: activeFilter === NOTIFICATION_FILTER.UNREAD,
          })}
          onClick={() => handleFilterChange(NOTIFICATION_FILTER.UNREAD)}
        >
          {t("notification.filter_unread")}
        </button>
      </div>

      <div className={cx("list")}>
        {isLoading ? (
          <div className={cx("loadingState")}>
            <BaseLoading size="sm" variant="inline" />
          </div>
        ) : filteredNotifications.length ? (
          <>
            {visibleNotifications.map((notification, index) => {
              const dateGroup = getNotificationDateGroup(
                notification.createdAt,
                currentTime,
              );
              const previousDateGroup = visibleNotifications[index - 1]
                ? getNotificationDateGroup(
                    visibleNotifications[index - 1].createdAt,
                    currentTime,
                  )
                : null;

              return (
                <div key={notification.id} className={cx("notificationEntry")}>
                  {dateGroup !== previousDateGroup && (
                    <p className={cx("dateGroupTitle")}>
                      {t(`notification.group_${dateGroup}`)}
                    </p>
                  )}

                  <div
                    className={cx("item", {
                      unread: !notification.isRead,
                    })}
                  >
                    <button
                      type="button"
                      className={cx("itemButton")}
                      onClick={() => handleNotificationClick(notification.id)}
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
                            {t(
                              notification.titleKey,
                              notification.contentValues,
                            )}
                          </span>
                          {!notification.isRead && (
                            <span className={cx("unreadDot")} />
                          )}
                        </span>
                        <span className={cx("description")}>
                          {t(
                            notification.descriptionKey,
                            notification.contentValues,
                          )}
                        </span>
                        <span className={cx("meta")}>
                          {getTypeLabel(notification.type)}
                          <span aria-hidden="true">•</span>
                          {currentTime > 0 &&
                            formatNotificationTime(
                              notification.createdAt,
                              i18n.language,
                              currentTime,
                            )}
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className={cx("deleteButton")}
                      aria-label={t("notification.delete")}
                      disabled={processingNotificationId === notification.id}
                      onClick={(event) =>
                        handleDeleteNotification(event, notification.id)
                      }
                    >
                      <IconClose
                        strokePath="currentColor"
                        width={14}
                        height={14}
                      />
                    </button>
                  </div>
                </div>
              );
            })}

            {hasMoreNotifications && (
              <button
                type="button"
                className={cx("loadMoreButton")}
                onClick={handleLoadMore}
              >
                {t("notification.view_previous")}
              </button>
            )}
          </>
        ) : (
          <div className={cx("emptyState")}>
            {t(
              activeFilter === NOTIFICATION_FILTER.UNREAD
                ? "notification.empty_unread"
                : "notification.empty",
            )}
          </div>
        )}
      </div>

      {error && <p className={cx("errorMessage")}>{t("notification.error")}</p>}

      <div className={cx("footer")}>
        <BaseButton
          isStatic
          size="sm"
          isDisabled={unreadCount === 0}
          isLoading={isMarkingAllAsRead}
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
