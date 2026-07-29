// ============================================================
// SECURITY SETTINGS CARD
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Components, Images, Icons =====
import { icons } from "@/assets";
import { BaseButton, BaseInput } from "@/components";
import SettingsCard from "./SettingsCard";

// ===== Others =====
import {
  SETTINGS_SECTION,
  SETTINGS_SECTION_CONTENT_ID,
  SETTINGS_SECTION_ICON,
} from "@/utils/constants";
import { InputTypeEnum } from "@/utils/enum";
import type { SecuritySettingsCardProps } from "../types";

// ===== Styles =====
import styles from "./SettingsCard.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const SecuritySettingsCard = ({
  values,
  validationMessages,
  requestError,
  isOpen,
  isValid,
  isLoading,
  isUpdated,
  onToggle,
  onChange,
  onSubmit,
}: SecuritySettingsCardProps) => {
  const { t } = useTranslation();
  const renderPasswordToggle = (isShow: boolean) => (
    <img
      className={cx("toggleIcon")}
      src={isShow ? icons.iconEyeOff : icons.iconEyeShow}
      alt={
        isShow
          ? t("auth.login.hide_password")
          : t("auth.login.show_password")
      }
    />
  );

  return (
    <SettingsCard
      section={SETTINGS_SECTION.SECURITY}
      contentId={SETTINGS_SECTION_CONTENT_ID.SECURITY}
      icon={SETTINGS_SECTION_ICON.SECURITY}
      title={t("settings.security_title")}
      description={t("settings.security_description")}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className={cx("securityForm")}>
        <BaseInput
          id="settings-current-password"
          type={InputTypeEnum.PASSWORD}
          label={t("settings.current_password")}
          placeholder={t("settings.current_password_placeholder")}
          value={values.currentPassword}
          renderPasswordToggle={renderPasswordToggle}
          onChange={(event) =>
            onChange("currentPassword", event.target.value)
          }
        />
        <BaseInput
          id="settings-new-password"
          type={InputTypeEnum.PASSWORD}
          label={t("settings.new_password")}
          placeholder={t("settings.new_password_placeholder")}
          value={values.newPassword}
          messageError={validationMessages.newPassword}
          renderPasswordToggle={renderPasswordToggle}
          onChange={(event) => onChange("newPassword", event.target.value)}
        />
        <BaseInput
          id="settings-confirm-password"
          type={InputTypeEnum.PASSWORD}
          label={t("settings.confirm_new_password")}
          placeholder={t("settings.confirm_new_password_placeholder")}
          value={values.confirmPassword}
          messageError={validationMessages.confirmPassword}
          renderPasswordToggle={renderPasswordToggle}
          onChange={(event) =>
            onChange("confirmPassword", event.target.value)
          }
        />

        <div className={cx("passwordAction")}>
          <div>
            {requestError && (
              <p className={cx("passwordError")}>{requestError}</p>
            )}
            {isUpdated && (
              <p className={cx("passwordSuccess")}>
                {t("settings.password_updated")}
              </p>
            )}
          </div>
          <BaseButton
            isStatic
            isLoading={isLoading}
            isDisabled={!isValid}
            className={cx("settingsActionButton")}
            onClick={onSubmit}
          >
            {t("settings.change_password")}
          </BaseButton>
        </div>
      </div>
    </SettingsCard>
  );
};

export default SecuritySettingsCard;
