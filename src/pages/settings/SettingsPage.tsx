// ============================================================
// SETTINGS PAGE
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

// ===== Components =====
import { BaseLoading } from "@/components";
import {
  NotificationsSettingsCard,
  PreferencesSettingsCard,
  ProfileSettingsCard,
  SecuritySettingsCard,
} from "./components";

// ===== Others =====
import { useAppDispatch, useAuth, useSettings } from "@/redux/hooks";
import {
  changeSettingsPasswordThunk,
  updateSettingsThunk,
} from "@/redux/thunks/settings/settingsThunk";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PASSWORD_SETTINGS_VALUES,
  DEFAULT_SETTINGS_LANGUAGE,
  EMPTY_STRING,
  SETTINGS_PASSWORD_MIN_LENGTH,
  SETTINGS_SCROLL_FADE_THRESHOLD,
  SETTINGS_SECTION,
} from "@/utils/constants";
import { getSettingsSectionFromHash } from "./helpers";
import type {
  NotificationSettingKey,
  PasswordSettingsValues,
} from "./types";
import type { SettingsSection } from "@/features/settings/settings.types";
import { getErrorMessage } from "@/utils/errors";

// ===== Styles =====
import styles from "./SettingsPage.module.scss";

const cx = classNames.bind(styles);

const SettingsPage = () => {
  // ===== Hooks =====
  const { user } = useAuth();
  const {
    data: savedSettings,
    loading,
    isSaving,
    isChangingPassword,
  } = useSettings();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // ===== States =====
  const [openSection, setOpenSection] = useState<SettingsSection | null>(
    getSettingsSectionFromHash(location.hash),
  );
  const [fullName, setFullName] = useState(EMPTY_STRING);
  const [language, setLanguage] = useState(
    i18n.resolvedLanguage ?? DEFAULT_SETTINGS_LANGUAGE,
  );
  const [notifications, setNotifications] = useState(
    DEFAULT_NOTIFICATION_SETTINGS,
  );
  const [passwordValues, setPasswordValues] = useState<PasswordSettingsValues>(
    DEFAULT_PASSWORD_SETTINGS_VALUES,
  );
  const [passwordError, setPasswordError] = useState(EMPTY_STRING);
  const [savedSection, setSavedSection] = useState<SettingsSection | null>(
    null,
  );
  const [isFullNameTouched, setIsFullNameTouched] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isContentScrolled, setIsContentScrolled] = useState(false);

  // ===== Derived =====
  const isSettingsFormValid = Boolean(fullName.trim());
  const hasProfileChanges = Boolean(
    savedSettings &&
      fullName.trim() !== savedSettings.fullName.trim(),
  );
  const hasPreferencesChanges = Boolean(
    savedSettings && language !== savedSettings.language,
  );
  const hasNotificationsChanges = Boolean(
    savedSettings &&
      (notifications.emailNotifications !==
        savedSettings.notifications.emailNotifications ||
        notifications.orderUpdates !== savedSettings.notifications.orderUpdates ||
        notifications.lowStockAlerts !==
          savedSettings.notifications.lowStockAlerts),
  );
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
    if (!savedSettings) return;

    const frameId = requestAnimationFrame(() => {
      setFullName(savedSettings.fullName);
      setLanguage(savedSettings.language);
      setNotifications(savedSettings.notifications);
    });

    return () => cancelAnimationFrame(frameId);
  }, [savedSettings]);

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

    if (section === SETTINGS_SECTION.PROFILE && !nextSection) {
      setFullName(savedSettings?.fullName ?? EMPTY_STRING);
      setIsFullNameTouched(false);
      setSavedSection(null);
    }

    if (section === SETTINGS_SECTION.PREFERENCES && !nextSection) {
      setLanguage(savedSettings?.language ?? DEFAULT_SETTINGS_LANGUAGE);
      setSavedSection(null);
    }

    if (section === SETTINGS_SECTION.NOTIFICATIONS && !nextSection) {
      setNotifications(
        savedSettings?.notifications ?? DEFAULT_NOTIFICATION_SETTINGS,
      );
      setSavedSection(null);
    }

    if (section === SETTINGS_SECTION.SECURITY && !nextSection) {
      setPasswordValues(DEFAULT_PASSWORD_SETTINGS_VALUES);
      setPasswordError(EMPTY_STRING);
      setIsPasswordUpdated(false);
    }

    setOpenSection(nextSection);
    navigate(
      {
        pathname: location.pathname,
        hash: nextSection ?? "",
      },
      { replace: true },
    );
  };

  const handleSaveProfile = async () => {
    if (!isSettingsFormValid || !user?.id) return;

    try {
      await dispatch(
        updateSettingsThunk({
          userId: user.id,
          fullName,
        }),
      ).unwrap();
      setSavedSection(SETTINGS_SECTION.PROFILE);
    } catch {
      setSavedSection(null);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.id) return;

    try {
      await dispatch(
        updateSettingsThunk({
          userId: user.id,
          language,
        }),
      ).unwrap();
      await i18n.changeLanguage(language);
      setSavedSection(SETTINGS_SECTION.PREFERENCES);
    } catch {
      setSavedSection(null);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user?.id) return;

    try {
      await dispatch(
        updateSettingsThunk({
          userId: user.id,
          notifications,
        }),
      ).unwrap();
      setSavedSection(SETTINGS_SECTION.NOTIFICATIONS);
    } catch {
      setSavedSection(null);
    }
  };

  const handleNotificationToggle = (key: NotificationSettingKey) => {
    setSavedSection(null);
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
    setPasswordError(EMPTY_STRING);
    setIsPasswordUpdated(false);
  };

  const handleChangePassword = async () => {
    if (!isPasswordFormValid || !user?.email) {
      setPasswordError(t("settings.password_update_error"));
      return;
    }

    setPasswordError(EMPTY_STRING);
    setIsPasswordUpdated(false);

    try {
      await dispatch(
        changeSettingsPasswordThunk({
          email: user.email,
          currentPassword: passwordValues.currentPassword,
          newPassword: passwordValues.newPassword,
        }),
      ).unwrap();

      setPasswordValues(DEFAULT_PASSWORD_SETTINGS_VALUES);
      setIsPasswordUpdated(true);
    } catch (error) {
      setPasswordError(getErrorMessage(error, t));
    }
  };

  // ===== Render =====
  return (
    <div className={cx("wrapper")}>
      <header className={cx("pageHeader")}>
        <div>
          <p className={cx("pageTitle")}>{t("settings.title")}</p>
          <p className={cx("pageDescription")}>{t("settings.description")}</p>
        </div>
      </header>

      <div
        className={cx("content", { contentScrolled: isContentScrolled })}
        onScroll={(event) => {
          setIsContentScrolled(
            event.currentTarget.scrollTop > SETTINGS_SCROLL_FADE_THRESHOLD,
          );
        }}
      >
        {loading ? (
          <BaseLoading variant="section" />
        ) : (
          <>
            <ProfileSettingsCard
              fullName={fullName}
              email={user?.email ?? ""}
              isOpen={openSection === SETTINGS_SECTION.PROFILE}
              isFullNameTouched={isFullNameTouched}
              isValid={isSettingsFormValid}
              hasChanges={hasProfileChanges}
              isSaving={isSaving}
              isSaved={savedSection === SETTINGS_SECTION.PROFILE}
              onToggle={handleToggleSection}
              onFullNameBlur={() => setIsFullNameTouched(true)}
              onFullNameChange={(value) => {
                setFullName(value);
                setSavedSection(null);
              }}
              onSave={handleSaveProfile}
            />

            <SecuritySettingsCard
              values={passwordValues}
              validationMessages={passwordValidationMessages}
              requestError={passwordError}
              isOpen={openSection === SETTINGS_SECTION.SECURITY}
              isValid={isPasswordFormValid}
              isLoading={isChangingPassword}
              isUpdated={isPasswordUpdated}
              onToggle={handleToggleSection}
              onChange={handlePasswordChange}
              onSubmit={handleChangePassword}
            />

            <PreferencesSettingsCard
              language={language}
              isOpen={openSection === SETTINGS_SECTION.PREFERENCES}
              hasChanges={hasPreferencesChanges}
              isSaving={isSaving}
              isSaved={savedSection === SETTINGS_SECTION.PREFERENCES}
              onToggle={handleToggleSection}
              onLanguageChange={(value) => {
                setLanguage(value);
                setSavedSection(null);
              }}
              onSave={handleSavePreferences}
            />

            <NotificationsSettingsCard
              notifications={notifications}
              isOpen={openSection === SETTINGS_SECTION.NOTIFICATIONS}
              hasChanges={hasNotificationsChanges}
              isSaving={isSaving}
              isSaved={savedSection === SETTINGS_SECTION.NOTIFICATIONS}
              onToggle={handleToggleSection}
              onNotificationToggle={handleNotificationToggle}
              onSave={handleSaveNotifications}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
