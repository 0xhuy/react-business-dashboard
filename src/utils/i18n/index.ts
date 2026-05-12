// ============================================================
// I18N CONFIG
// ============================================================

// ===== Libs =====
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// ===== Others =====
import { LanguageEnum } from "../enum/language.enum";
import { Languages } from "../constants/language.constants";

// ===== Config =====
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: Languages,
    fallbackLng: LanguageEnum.EN,

    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },

    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
