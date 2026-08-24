// ===== Configs =====
import { supabase } from "@/services/supabase";
import { NOTIFICATION_LIST_LIMIT } from "@/utils/constants";

// ===== Types =====
import type {
  NotificationItem,
  NotificationType,
} from "./notification.types";

type NotificationRecord = {
  id: string;
  user_id: string;
  type: string;
  title_key: string;
  description_key: string;
  content_values: Record<string, string | number> | null;
  action_path: string | null;
  is_read: boolean;
  created_at: string;
};

const NOTIFICATION_COLUMNS =
  "id, user_id, type, title_key, description_key, content_values, action_path, is_read, created_at";

const mapNotification = (record: NotificationRecord): NotificationItem => ({
  id: record.id,
  userId: record.user_id,
  type: record.type as NotificationType,
  titleKey: record.title_key,
  descriptionKey: record.description_key,
  contentValues: record.content_values ?? {},
  actionPath: record.action_path,
  isRead: record.is_read,
  createdAt: record.created_at,
});

const getNotifications = async (userId: string): Promise<NotificationItem[]> => {
  const { data, error } = await supabase
    .from("notifications")
    .select(NOTIFICATION_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(NOTIFICATION_LIST_LIMIT);

  if (error) throw error;

  return ((data ?? []) as NotificationRecord[]).map(mapNotification);
};

const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
): Promise<string> => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select("id")
    .single();

  if (error) throw error;

  return String(data.id);
};

const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
};

const deleteNotification = async (
  notificationId: string,
  userId: string,
): Promise<string> => {
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select("id")
    .single();

  if (error) throw error;

  return String(data.id);
};

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
