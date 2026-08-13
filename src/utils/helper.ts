// ===== Others =====
import { matchPath } from "react-router-dom";
import {
  LanguageCurrencyEnum,
  LanguageEnum,
  LanguageLocaleEnum,
} from "./enum/language.enum";
import type { IRouteModel } from "./interfaces";
import { PRODUCT_CATEGORY_OPTIONS } from "./constants/product.constants";

// ============================================================
// ROUTE
// ============================================================

/**
 * Determines whether the current path is a nested route of the parent path.
 *
 * @param parentPath Parent route path.
 * @param currentPath Current location path.
 * @returns True when current path is a nested route of the parent path.
 */
export const isNestedRoute = (
  parentPath: string,
  currentPath: string,
): boolean => {
  return currentPath.startsWith(parentPath) && currentPath !== parentPath;
};

/**
 * Checks whether a route or any of its children matches the current path.
 *
 * @param route Route configuration.
 * @param locationPathname Current location pathname.
 * @returns True when route or child route is active.
 */
export const hasActiveChild = (
  route: IRouteModel,
  locationPathname: string,
): boolean => {
  const isCurrentRoute = Boolean(
    matchPath(
      {
        path: route.path,
        end: route.index ?? !route.children?.length,
      },
      locationPathname,
    ),
  );

  return (
    isCurrentRoute ||
    Boolean(
      route.children?.some((child) => hasActiveChild(child, locationPathname)),
    )
  );
};

// ============================================================
// LANGUAGE
// ============================================================

/**
 * Normalizes i18n language to supported application languages.
 *
 * @param language Current i18n language.
 * @returns Supported language enum.
 */
export const getLanguage = (language: string): LanguageEnum => {
  return language === LanguageEnum.VI ? LanguageEnum.VI : LanguageEnum.EN;
};

// ============================================================
// FORMATTER
// ============================================================

/**
 * Creates a currency formatter based on the current application language.
 *
 * @param language Current i18n language.
 * @returns Intl.NumberFormat instance configured with locale and currency.
 */
export const getCurrencyFormatter = (language: string): Intl.NumberFormat => {
  const currentLanguage = getLanguage(language);

  return new Intl.NumberFormat(
    currentLanguage === LanguageEnum.VI
      ? LanguageLocaleEnum.VI
      : LanguageLocaleEnum.EN,
    {
      style: "currency",
      currency:
        currentLanguage === LanguageEnum.VI
          ? LanguageCurrencyEnum.VI
          : LanguageCurrencyEnum.EN,
    },
  );
};

// ============================================================
// PRODUCT
// ============================================================

export const normalizeProductCategory = (value: unknown): string => {
  const normalizedValue = String(value ?? "")
    .trim()
    .toLowerCase();
  const matchedCategory = PRODUCT_CATEGORY_OPTIONS.find(
    (option) =>
      option.value.toLowerCase() === normalizedValue ||
      option.label.toLowerCase() === normalizedValue,
  );

  return matchedCategory?.value ?? "";
};

export const isProductCategory = (value: unknown): boolean =>
  Boolean(normalizeProductCategory(value));
