// ============================================================
// PROFILE SETTINGS CARD
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Components =====
import { BaseButton, BaseInput } from "@/components";
import SettingsCard from "./SettingsCard";

// ===== Others =====
import {
  SETTINGS_SECTION,
  SETTINGS_SECTION_CONTENT_ID,
  SETTINGS_SECTION_ICON,
} from "@/utils/constants";
import type { ProfileSettingsCardProps } from "../types";

// ===== Styles =====
import styles from "./SettingsCard.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const ProfileSettingsCard = ({
  fullName,
  email,
  isOpen,
  isFullNameTouched,
  isValid,
  hasChanges,
  isSaving,
  isSaved,
  onToggle,
  onFullNameBlur,
  onFullNameChange,
  onSave,
}: ProfileSettingsCardProps) => {
  const { t } = useTranslation();

  return (
    <SettingsCard
      section={SETTINGS_SECTION.PROFILE}
      contentId={SETTINGS_SECTION_CONTENT_ID.PROFILE}
      icon={SETTINGS_SECTION_ICON.PROFILE}
      title={t("settings.profile_title")}
      description={t("settings.profile_description")}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className={cx("formGrid")}>
        <BaseInput
          id="settings-full-name"
          label={t("settings.full_name")}
          value={fullName}
          placeholder={t("settings.full_name_placeholder")}
          messageError={
            isFullNameTouched && !isValid ? t("common.required") : ""
          }
          onBlur={onFullNameBlur}
          onChange={(event) => onFullNameChange(event.target.value)}
        />
        <BaseInput
          id="settings-email"
          className={cx("readonlyInput")}
          label={t("settings.email")}
          value={email}
          disabled
        />
      </div>

      <div className={cx("cardAction")}>
        {isSaved && (
          <span className={cx("successMessage")}>{t("settings.saved")}</span>
        )}
        <BaseButton
          isStatic
          isDisabled={!isValid || !hasChanges}
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

export default ProfileSettingsCard;
