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
import type { SettingsSection } from "@/utils/constants";
import type { LanguageEnum } from "@/utils/enum";
import { getLanguage } from "@/utils/helper";

// ===== Styles =====
import styles from "./SettingsCard.module.scss";

const cx = classNames.bind(styles);

type PreferencesSettingsCardProps = {
  language: LanguageEnum;
  isOpen: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onToggle: (section: SettingsSection) => void;
  onLanguageChange: (value: LanguageEnum) => void;
  onSave: () => void;
};

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
          label={t("settings.language")}
          value={language}
          options={SETTINGS_LANGUAGE_OPTIONS}
          onChange={(option) => onLanguageChange(getLanguage(option.value))}
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
