// ===== Libs =====
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// ===== Others =====
import { LanguageEnum } from "../enum/language.enum";
import { Languages } from "../constants/language.constants";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: Languages,
    lng: LanguageEnum.EN,
    fallbackLng: LanguageEnum.EN,

    react: { useSuspense: false },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["path", "cookie", "htmlTag"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
  });

export default i18n;
