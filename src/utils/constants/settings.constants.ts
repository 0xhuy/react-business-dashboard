// ============================================================
// SETTINGS CONSTANTS
// ============================================================

// ===== Others =====
import { LanguageEnum } from "@/utils/enum";

// ===== Constants =====
export const SETTINGS_STORAGE_KEY = "dashboard-settings";
export const SETTINGS_PASSWORD_MIN_LENGTH = 8;
export const SETTINGS_SCROLL_FADE_THRESHOLD = 0;
export const DEFAULT_SETTINGS_LANGUAGE = LanguageEnum.EN;

export const SETTINGS_SECTION = {
  PROFILE: "profile",
  SECURITY: "security",
  PREFERENCES: "preferences",
  NOTIFICATIONS: "notifications",
} as const;

export const SETTINGS_SECTIONS = Object.values(SETTINGS_SECTION);

export const SETTINGS_SECTION_CONTENT_ID = {
  PROFILE: `${SETTINGS_SECTION.PROFILE}-content`,
  SECURITY: `${SETTINGS_SECTION.SECURITY}-content`,
  PREFERENCES: `${SETTINGS_SECTION.PREFERENCES}-content`,
  NOTIFICATIONS: `${SETTINGS_SECTION.NOTIFICATIONS}-content`,
} as const;

export const SETTINGS_SECTION_ICON = {
  PROFILE: "P",
  SECURITY: "S",
  PREFERENCES: "A",
  NOTIFICATIONS: "N",
} as const;

export const DEFAULT_NOTIFICATION_SETTINGS = {
  emailNotifications: true,
  orderUpdates: true,
  lowStockAlerts: true,
};

export const DEFAULT_PASSWORD_SETTINGS_VALUES = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const SETTINGS_NOTIFICATION_KEYS = Object.keys(
  DEFAULT_NOTIFICATION_SETTINGS,
) as Array<keyof typeof DEFAULT_NOTIFICATION_SETTINGS>;

export const SETTINGS_LANGUAGE_OPTIONS = [
  {
    label: "settings.language_english",
    value: LanguageEnum.EN,
  },
  {
    label: "settings.language_vietnamese",
    value: LanguageEnum.VI,
  },
];
