export type NotificationType = "order" | "stock" | "system";
export type NotificationFilter = "all" | "unread";
export type NotificationDateGroup = "today" | "yesterday" | "earlier";

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
