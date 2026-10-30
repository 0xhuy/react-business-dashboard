// ============================================================
// SETTINGS HELPERS
// ============================================================

// ===== Others =====
import {
  SETTINGS_SECTIONS,
} from "@/utils/constants";
import type { SettingsSection } from "@/utils/constants";

const isSettingsSection = (value: string): value is SettingsSection =>
  SETTINGS_SECTIONS.some((section) => section === value);

// ===== Helpers =====
export const getSettingsSectionFromHash = (
  hash: string,
): SettingsSection | null => {
  const section = hash.slice(1);

  return isSettingsSection(section) ? section : null;
};
