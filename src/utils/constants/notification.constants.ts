// ============================================================
// NOTIFICATION CONSTANTS
// ============================================================

export const NOTIFICATION_BADGE_MAX_COUNT = 99;

export const NOTIFICATION_TYPE = {
  ORDER: "order",
  STOCK: "stock",
  SYSTEM: "system",
} as const;

export const MOCK_NOTIFICATIONS = [
  {
    id: "notification-order-po-0001",
    type: NOTIFICATION_TYPE.ORDER,
    titleKey: "notification.order_updated_title",
    descriptionKey: "notification.order_updated_description",
    timeKey: "notification.minutes_ago",
    timeValue: 5,
    isRead: false,
  },
  {
    id: "notification-low-stock-prd-003",
    type: NOTIFICATION_TYPE.STOCK,
    titleKey: "notification.low_stock_title",
    descriptionKey: "notification.low_stock_description",
    timeKey: "notification.hours_ago",
    timeValue: 2,
    isRead: false,
  },
  {
    id: "notification-system-settings",
    type: NOTIFICATION_TYPE.SYSTEM,
    titleKey: "notification.settings_saved_title",
    descriptionKey: "notification.settings_saved_description",
    timeKey: "notification.days_ago",
    timeValue: 1,
    isRead: true,
  },
] as const;

export const DEFAULT_UNREAD_NOTIFICATION_COUNT = MOCK_NOTIFICATIONS.filter(
  (notification) => !notification.isRead,
).length;
