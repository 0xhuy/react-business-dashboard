// ============================================================
// NOTIFICATION CONSTANTS
// ============================================================

export const NOTIFICATION_BADGE_MAX_COUNT = 99;
export const NOTIFICATION_LIST_LIMIT = 30;
export const NOTIFICATION_INITIAL_VISIBLE_COUNT = 5;
export const NOTIFICATION_LOAD_MORE_COUNT = 5;
export const NOTIFICATION_TIME_REFRESH_INTERVAL = 60_000;

export const NOTIFICATION_FILTER = {
  ALL: "all",
  UNREAD: "unread",
} as const;

export const NOTIFICATION_DATE_GROUP = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  EARLIER: "earlier",
} as const;

export const NOTIFICATION_TYPE = {
  ORDER: "order",
  STOCK: "stock",
  SYSTEM: "system",
} as const;
