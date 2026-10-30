// ============================================================
// SETTINGS TYPES
// ============================================================

import type { LanguageEnum } from "@/utils/enum";

// ===== Types =====
export type NotificationSettings = {
  emailNotifications: boolean;
  orderUpdates: boolean;
  lowStockAlerts: boolean;
};

export type SettingsData = {
  fullName: string;
  language: LanguageEnum;
  notifications: NotificationSettings;
};

export type UpdateSettingsPayload = {
  userId: string;
  fullName?: string;
  language?: LanguageEnum;
  notifications?: NotificationSettings;
};

export type ChangePasswordPayload = {
  email: string;
  currentPassword: string;
  newPassword: string;
};
