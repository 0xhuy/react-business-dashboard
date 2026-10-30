// ===== Types =====
import type { NotificationItem } from "@/features/notifications/notification.types";

export type NotificationState = {
  notifications: NotificationItem[];
  loading: boolean;
  processingNotificationId: string | null;
  isMarkingAllAsRead: boolean;
  error: string | null;
};
