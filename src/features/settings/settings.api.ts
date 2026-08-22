// ============================================================
// SETTINGS API
// ============================================================

// ===== Others =====
import authApi from "@/features/auth/auth.api";
import { supabase } from "@/services/supabase";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_SETTINGS_LANGUAGE,
} from "@/utils/constants";
import type {
  ChangePasswordPayload,
  SettingsData,
  UpdateSettingsPayload,
} from "./settings.types";

// ===== Types =====
type ProfileRecord = {
  full_name: string;
};

type UserSettingsRecord = {
  language: string;
  email_notifications: boolean;
  order_updates: boolean;
  low_stock_alerts: boolean;
};

// ===== Mappers =====
const mapSettings = (
  profile: ProfileRecord,
  settings: UserSettingsRecord | null,
): SettingsData => ({
  fullName: profile.full_name,
  language: settings?.language ?? DEFAULT_SETTINGS_LANGUAGE,
  notifications: {
    emailNotifications:
      settings?.email_notifications ??
      DEFAULT_NOTIFICATION_SETTINGS.emailNotifications,
    orderUpdates:
      settings?.order_updates ?? DEFAULT_NOTIFICATION_SETTINGS.orderUpdates,
    lowStockAlerts:
      settings?.low_stock_alerts ??
      DEFAULT_NOTIFICATION_SETTINGS.lowStockAlerts,
  },
});

// ===== API =====
const getSettings = async (userId: string): Promise<SettingsData> => {
  const [profileResult, settingsResult] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", userId).single(),
    supabase
      .from("user_settings")
      .select(
        "language, email_notifications, order_updates, low_stock_alerts",
      )
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (settingsResult.error) throw settingsResult.error;

  return mapSettings(
    profileResult.data as ProfileRecord,
    settingsResult.data as UserSettingsRecord | null,
  );
};

const updateSettings = async ({
  userId,
  fullName,
  language,
  notifications,
}: UpdateSettingsPayload): Promise<SettingsData> => {
  if (fullName !== undefined) {
    const normalizedFullName = fullName.trim();
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: normalizedFullName })
      .eq("id", userId);

    if (profileError) throw profileError;

    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: normalizedFullName },
    });

    if (authError) throw authError;
  }

  if (language !== undefined || notifications !== undefined) {
    const settingsPayload = {
      user_id: userId,
      ...(language !== undefined && { language }),
      ...(notifications !== undefined && {
        email_notifications: notifications.emailNotifications,
        order_updates: notifications.orderUpdates,
        low_stock_alerts: notifications.lowStockAlerts,
      }),
    };
    const { error: settingsError } = await supabase
      .from("user_settings")
      .upsert(settingsPayload, { onConflict: "user_id" });

    if (settingsError) throw settingsError;
  }

  return getSettings(userId);
};

const changePassword = async ({
  email,
  currentPassword,
  newPassword,
}: ChangePasswordPayload): Promise<void> => {
  const { error: loginError } = await authApi.login({
    email,
    password: currentPassword,
  });

  if (loginError) throw new Error("CURRENT_PASSWORD_INCORRECT");

  const { error: updateError } =
    await authApi.createNewPassword(newPassword);

  if (updateError) throw updateError;
};

export default {
  getSettings,
  updateSettings,
  changePassword,
};
