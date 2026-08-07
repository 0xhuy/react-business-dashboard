// ============================================================
// NOTIFICATION POPOVER TYPES
// ============================================================

// ===== Others =====
import type {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_TYPE,
} from "@/utils/constants";

// ===== Types =====
export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export type NotificationItem = Omit<
  (typeof MOCK_NOTIFICATIONS)[number],
  "isRead"
> & {
  isRead: boolean;
};

export type NotificationPopoverProps = {
  isOpen: boolean;
  onUnreadCountChange: (count: number) => void;
};
