// ============================================================
// SETTINGS PAGE
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

// ===== Components =====
import { BaseButton } from "@/components";
import {
  NotificationsSettingsCard,
  PreferencesSettingsCard,
  ProfileSettingsCard,
  SecuritySettingsCard,
} from "./components";

// ===== Others =====
import authApi from "@/features/auth/auth.api";
import { useAuth } from "@/redux/hooks";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PASSWORD_SETTINGS_VALUES,
  DEFAULT_SETTINGS_LANGUAGE,
  EMPTY_STRING,
  SETTINGS_PASSWORD_MIN_LENGTH,
  SETTINGS_SCROLL_FADE_THRESHOLD,
  SETTINGS_SECTION,
} from "@/utils/constants";
import {
  getSettingsSectionFromHash,
  getStoredSettings,
  saveStoredSettings,
} from "./helpers";
import type {
  NotificationSettingKey,
  PasswordSettingsValues,
  SettingsSection,
} from "./types";

// ===== Styles =====
import styles from "./SettingsPage.module.scss";

const cx = classNames.bind(styles);

const SettingsPage = () => {
  // ===== Hooks =====
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // ===== States =====
  const [storedSettings] = useState(getStoredSettings);
  const [openSection, setOpenSection] = useState<SettingsSection | null>(
    getSettingsSectionFromHash(location.hash),
  );
  const [fullName, setFullName] = useState<string | undefined>(
    storedSettings.fullName,
  );
  const [language, setLanguage] = useState(
    storedSettings.language ??
      i18n.resolvedLanguage ??
      DEFAULT_SETTINGS_LANGUAGE,
  );
  const [notifications, setNotifications] = useState(
    storedSettings.notifications ?? DEFAULT_NOTIFICATION_SETTINGS,
  );
  const [passwordValues, setPasswordValues] = useState<PasswordSettingsValues>(
    DEFAULT_PASSWORD_SETTINGS_VALUES,
  );
  const [passwordError, setPasswordError] = useState(EMPTY_STRING);
  const [isSaved, setIsSaved] = useState(false);
  const [isFullNameTouched, setIsFullNameTouched] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isContentScrolled, setIsContentScrolled] = useState(false);

  // ===== Derived =====
  const displayedFullName =
    fullName ??
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    "";
  const isSettingsFormValid = Boolean(displayedFullName.trim());
  const isPasswordFormValid =
    Boolean(passwordValues.currentPassword) &&
    passwordValues.newPassword.length >= SETTINGS_PASSWORD_MIN_LENGTH &&
    Boolean(passwordValues.confirmPassword) &&
    passwordValues.newPassword === passwordValues.confirmPassword;
  const passwordValidationMessages = {
    newPassword:
      passwordValues.newPassword &&
      passwordValues.newPassword.length < SETTINGS_PASSWORD_MIN_LENGTH
        ? t("auth.validation.password_min_length")
        : "",
    confirmPassword:
      passwordValues.confirmPassword &&
      passwordValues.newPassword !== passwordValues.confirmPassword
        ? t("auth.validation.confirm_password_not_match")
        : "",
  };

  // ===== Effects =====
  useEffect(() => {
    const section = getSettingsSectionFromHash(location.hash);
    if (!section) return;

    const frameId = requestAnimationFrame(() => {
      setOpenSection(section);
      requestAnimationFrame(() => {
        document.getElementById(section)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [location.hash]);

  // ===== Handlers =====
  const handleToggleSection = (section: SettingsSection) => {
    const nextSection = openSection === section ? null : section;
    setOpenSection(nextSection);
    navigate(
      {
        pathname: location.pathname,
        hash: nextSection ?? "",
      },
      { replace: true },
    );
  };

  const handleSave = async () => {
    if (!isSettingsFormValid) return;

    saveStoredSettings({
      fullName: displayedFullName,
      language,
      notifications,
    });
    await i18n.changeLanguage(language);
    setIsSaved(true);
  };

  const handleNotificationToggle = (key: NotificationSettingKey) => {
    setIsSaved(false);
    setNotifications((currentSettings) => ({
      ...currentSettings,
      [key]: !currentSettings[key],
    }));
  };

  const handlePasswordChange = (
    field: keyof PasswordSettingsValues,
    value: string,
  ) => {
    setPasswordValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setPasswordError("");
    setIsPasswordUpdated(false);
  };

  const handleChangePassword = async () => {
    if (!isPasswordFormValid || !user?.email) {
      setPasswordError(t("settings.password_update_error"));
      return;
    }

    setPasswordError("");
    setIsPasswordUpdated(false);
    setIsUpdatingPassword(true);

    const { error: verifyError } = await authApi.login({
      email: user.email,
      password: passwordValues.currentPassword,
    });

    if (verifyError) {
      setPasswordError(t("settings.current_password_incorrect"));
      setIsUpdatingPassword(false);
      return;
    }

    const { error: updateError } = await authApi.createNewPassword(
      passwordValues.newPassword,
    );

    if (updateError) {
      setPasswordError(updateError.message);
      setIsUpdatingPassword(false);
      return;
    }

    setPasswordValues(DEFAULT_PASSWORD_SETTINGS_VALUES);
    setIsPasswordUpdated(true);
    setIsUpdatingPassword(false);
  };

  // ===== Render =====
  return (
    <div className={cx("wrapper")}>
      <header className={cx("pageHeader")}>
        <div>
          <p className={cx("pageTitle")}>{t("settings.title")}</p>
          <p className={cx("pageDescription")}>{t("settings.description")}</p>
        </div>

        {openSection !== SETTINGS_SECTION.SECURITY && (
          <div className={cx("saveArea")}>
            {isSaved && (
              <span className={cx("savedMessage")}>{t("settings.saved")}</span>
            )}
            <BaseButton
              isStatic
              isDisabled={!isSettingsFormValid}
              className={cx("saveButton")}
              onClick={handleSave}
            >
              {t("common.btn_save")}
            </BaseButton>
          </div>
        )}
      </header>

      <div
        className={cx("content", { contentScrolled: isContentScrolled })}
        onScroll={(event) => {
          setIsContentScrolled(
            event.currentTarget.scrollTop > SETTINGS_SCROLL_FADE_THRESHOLD,
          );
        }}
      >
        <ProfileSettingsCard
          fullName={displayedFullName}
          email={user?.email ?? ""}
          isOpen={openSection === SETTINGS_SECTION.PROFILE}
          isFullNameTouched={isFullNameTouched}
          isValid={isSettingsFormValid}
          onToggle={handleToggleSection}
          onFullNameBlur={() => setIsFullNameTouched(true)}
          onFullNameChange={(value) => {
            setFullName(value);
            setIsSaved(false);
          }}
        />

        <SecuritySettingsCard
          values={passwordValues}
          validationMessages={passwordValidationMessages}
          requestError={passwordError}
          isOpen={openSection === SETTINGS_SECTION.SECURITY}
          isValid={isPasswordFormValid}
          isLoading={isUpdatingPassword}
          isUpdated={isPasswordUpdated}
          onToggle={handleToggleSection}
          onChange={handlePasswordChange}
          onSubmit={handleChangePassword}
        />

        <PreferencesSettingsCard
          language={language}
          isOpen={openSection === SETTINGS_SECTION.PREFERENCES}
          onToggle={handleToggleSection}
          onLanguageChange={(value) => {
            setLanguage(value);
            setIsSaved(false);
          }}
        />

        <NotificationsSettingsCard
          notifications={notifications}
          isOpen={openSection === SETTINGS_SECTION.NOTIFICATIONS}
          onToggle={handleToggleSection}
          onNotificationToggle={handleNotificationToggle}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
