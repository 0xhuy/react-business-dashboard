// ============================================================
// SETTINGS TYPES
// ============================================================

// ===== Libs =====
import type { ReactNode } from "react";
import type { NotificationSettings } from "@/features/settings/settings.types";

// ===== Others =====
import type {
  SETTINGS_SECTION,
} from "@/utils/constants";

// ===== Types =====
export type SettingsSection =
  (typeof SETTINGS_SECTION)[keyof typeof SETTINGS_SECTION];

export type NotificationSettingKey = keyof NotificationSettings;

export type PasswordSettingsValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type PasswordValidationMessages = {
  newPassword: string;
  confirmPassword: string;
};

export type SettingsCardProps = {
  section: SettingsSection;
  contentId: string;
  icon: string;
  title: string;
  description: string;
  isOpen: boolean;
  children: ReactNode;
  onToggle: (section: SettingsSection) => void;
};

export type ProfileSettingsCardProps = {
  fullName: string;
  email: string;
  isOpen: boolean;
  isFullNameTouched: boolean;
  isValid: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onToggle: (section: SettingsSection) => void;
  onFullNameBlur: () => void;
  onFullNameChange: (value: string) => void;
  onSave: () => void;
};

export type SecuritySettingsCardProps = {
  values: PasswordSettingsValues;
  validationMessages: PasswordValidationMessages;
  requestError: string;
  isOpen: boolean;
  isValid: boolean;
  isLoading: boolean;
  isUpdated: boolean;
  onToggle: (section: SettingsSection) => void;
  onChange: (field: keyof PasswordSettingsValues, value: string) => void;
  onSubmit: () => void;
};

export type PreferencesSettingsCardProps = {
  language: string;
  isOpen: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onToggle: (section: SettingsSection) => void;
  onLanguageChange: (value: string) => void;
  onSave: () => void;
};

export type NotificationsSettingsCardProps = {
  notifications: NotificationSettings;
  isOpen: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onToggle: (section: SettingsSection) => void;
  onNotificationToggle: (key: NotificationSettingKey) => void;
  onSave: () => void;
};
