// ============================================================
// LANGUAGE SWITCHER
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Others =====
import { LANGUAGES } from "@/utils/constants";

// ===== Styles =====
import styles from "./LanguageSwitcher.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const LanguageSwitcher = () => {
  // ===== Hooks =====
  const { i18n } = useTranslation();

  // ===== Handlers =====
  const handleChangeLanguage = async (lng: string) => {
    if (i18n.language === lng) return;

    await i18n.changeLanguage(lng);
  };

  // ===== Render =====
  return (
    <div className={cx("languageSwitcher")}>
      {LANGUAGES.map((LANGUAGES) => (
        <button
          key={LANGUAGES}
          type="button"
          className={cx(
            "languageButton",
            i18n.language === LANGUAGES && "languageButtonActive",
          )}
          onClick={() => handleChangeLanguage(LANGUAGES)}
        >
          {LANGUAGES.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
