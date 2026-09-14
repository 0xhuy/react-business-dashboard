import type {
  NOTIFICATION_DATE_GROUP,
  NOTIFICATION_FILTER,
  NOTIFICATION_TYPE,
} from "@/utils/constants/notification.constants";

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export type NotificationFilter =
  (typeof NOTIFICATION_FILTER)[keyof typeof NOTIFICATION_FILTER];

export type NotificationDateGroup =
  (typeof NOTIFICATION_DATE_GROUP)[keyof typeof NOTIFICATION_DATE_GROUP];

export type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  titleKey: string;
  descriptionKey: string;
  contentValues: Record<string, string | number>;
  actionPath: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationMutationPayload = {
  notificationId: string;
  userId: string;
};
