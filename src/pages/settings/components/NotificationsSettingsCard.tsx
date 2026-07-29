// ============================================================
// NOTIFICATIONS SETTINGS CARD
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Components =====
import SettingsCard from "./SettingsCard";

// ===== Others =====
import {
  SETTINGS_NOTIFICATION_KEYS,
  SETTINGS_SECTION,
  SETTINGS_SECTION_CONTENT_ID,
  SETTINGS_SECTION_ICON,
} from "@/utils/constants";
import type { NotificationsSettingsCardProps } from "../types";

// ===== Styles =====
import styles from "./SettingsCard.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const NotificationsSettingsCard = ({
  notifications,
  isOpen,
  onToggle,
  onNotificationToggle,
}: NotificationsSettingsCardProps) => {
  const { t } = useTranslation();

  return (
    <SettingsCard
      section={SETTINGS_SECTION.NOTIFICATIONS}
      contentId={SETTINGS_SECTION_CONTENT_ID.NOTIFICATIONS}
      icon={SETTINGS_SECTION_ICON.NOTIFICATIONS}
      title={t("settings.notifications_title")}
      description={t("settings.notifications_description")}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className={cx("settingList")}>
        {SETTINGS_NOTIFICATION_KEYS.map((key) => (
          <div className={cx("settingRow")} key={key}>
            <div>
              <h3>{t(`settings.${key}_title`)}</h3>
              <p>{t(`settings.${key}_description`)}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications[key]}
              aria-label={t(`settings.${key}_title`)}
              className={cx("switch", {
                switchActive: notifications[key],
              })}
              onClick={() => onNotificationToggle(key)}
            >
              <span />
            </button>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};

export default NotificationsSettingsCard;
