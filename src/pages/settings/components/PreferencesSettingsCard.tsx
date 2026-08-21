// ============================================================
// PREFERENCES SETTINGS CARD
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Components =====
import { BaseButton, BaseSelect } from "@/components";
import SettingsCard from "./SettingsCard";

// ===== Others =====
import {
  SETTINGS_LANGUAGE_OPTIONS,
  SETTINGS_SECTION,
  SETTINGS_SECTION_CONTENT_ID,
  SETTINGS_SECTION_ICON,
} from "@/utils/constants";
import type { PreferencesSettingsCardProps } from "../types";

// ===== Styles =====
import styles from "./SettingsCard.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const PreferencesSettingsCard = ({
  language,
  isOpen,
  hasChanges,
  isSaving,
  isSaved,
  onToggle,
  onLanguageChange,
  onSave,
}: PreferencesSettingsCardProps) => {
  const { t } = useTranslation();

  return (
    <SettingsCard
      section={SETTINGS_SECTION.PREFERENCES}
      contentId={SETTINGS_SECTION_CONTENT_ID.PREFERENCES}
      icon={SETTINGS_SECTION_ICON.PREFERENCES}
      title={t("settings.preferences_title")}
      description={t("settings.preferences_description")}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className={cx("selectField")}>
        <BaseSelect
          name="language"
          label={t("settings.language")}
          value={language}
          options={SETTINGS_LANGUAGE_OPTIONS}
          onChange={(option) => onLanguageChange(String(option.value))}
        />
      </div>

      <div className={cx("cardAction")}>
        {isSaved && (
          <span className={cx("successMessage")}>{t("settings.saved")}</span>
        )}
        <BaseButton
          isStatic
          isDisabled={!hasChanges}
          isLoading={isSaving}
          className={cx("settingsActionButton")}
          onClick={onSave}
        >
          {t("common.btn_save")}
        </BaseButton>
      </div>
    </SettingsCard>
  );
};

export default PreferencesSettingsCard;
