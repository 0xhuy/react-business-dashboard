// ============================================================
// SETTINGS REDUX TYPES
// ============================================================

// ===== Others =====
import type { SettingsData } from "@/features/settings/settings.types";

// ===== Types =====
export type SettingsState = {
  data: SettingsData | null;
  loading: boolean;
  isSaving: boolean;
  isChangingPassword: boolean;
  error: string | null;
};
