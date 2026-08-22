// ============================================================
// SETTINGS HELPERS
// ============================================================

// ===== Others =====
import {
  SETTINGS_SECTIONS,
} from "@/utils/constants";
import type { SettingsSection } from "@/features/settings/settings.types";

// ===== Helpers =====
export const getSettingsSectionFromHash = (
  hash: string,
): SettingsSection | null => {
  const section = hash.slice(1) as SettingsSection;

  return SETTINGS_SECTIONS.includes(section) ? section : null;
};
