// ============================================================
// SETTINGS HELPERS
// ============================================================

// ===== Others =====
import {
  SETTINGS_SECTIONS,
  SETTINGS_STORAGE_KEY,
} from "@/utils/constants";
import type { SettingsSection, StoredSettings } from "./types";

// ===== Helpers =====
export const getStoredSettings = (): StoredSettings => {
  try {
    return JSON.parse(
      localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "{}",
    ) as StoredSettings;
  } catch {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    return {};
  }
};

export const saveStoredSettings = (settings: StoredSettings): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const getSettingsSectionFromHash = (
  hash: string,
): SettingsSection | null => {
  const section = hash.slice(1) as SettingsSection;

  return SETTINGS_SECTIONS.includes(section) ? section : null;
};
