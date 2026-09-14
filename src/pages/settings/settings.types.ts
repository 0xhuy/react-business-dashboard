// ============================================================
// SETTINGS TYPES
// ============================================================

import type { NotificationSettings } from "@/features/settings/settings.types";

// ===== Types =====
export type NotificationSettingKey = keyof NotificationSettings;

export type PasswordSettingsValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
