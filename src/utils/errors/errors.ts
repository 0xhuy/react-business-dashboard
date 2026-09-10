// ============================================================
// ERROR HANDLER
// ============================================================

// ===== Libs =====
import type { TFunction } from "i18next";

// ===== Others =====
import {
  ABORT_ERROR_NAME,
  DEFAULT_ERROR_TRANSLATION_KEY,
  ERROR_CODE,
  HTTP_ERROR_TRANSLATION_KEYS,
  HTTP_STATUS_CODE,
  NETWORK_ERROR_PATTERN,
  NETWORK_ERROR_TRANSLATION_KEY,
  SUPABASE_ERROR_TRANSLATION_KEYS,
} from "@/utils/constants";

// ===== Types =====
import type { AppError, DomainError } from "@/types/error.types";

type ErrorLike = {
  code?: unknown;
  message?: unknown;
  name?: unknown;
  status?: unknown;
};

// ===== Helpers =====
const isErrorLike = (error: unknown): error is ErrorLike =>
  typeof error === "object" && error !== null;

const isNetworkError = (error: ErrorLike) => {
  const message = typeof error.message === "string" ? error.message : "";

  return (
    error.name === ABORT_ERROR_NAME || NETWORK_ERROR_PATTERN.test(message)
  );
};

// ===== Error Handler =====
export const normalizeError = (error: unknown): AppError => {
  if (!isErrorLike(error)) {
    return {
      code: ERROR_CODE.UNKNOWN,
      translationKey: DEFAULT_ERROR_TRANSLATION_KEY,
      retryable: false,
    };
  }

  const code = typeof error.code === "string" ? error.code : ERROR_CODE.UNKNOWN;
  const status = typeof error.status === "number" ? error.status : undefined;

  if (isNetworkError(error)) {
    return {
      code: ERROR_CODE.NETWORK,
      translationKey: NETWORK_ERROR_TRANSLATION_KEY,
      retryable: true,
    };
  }

  const translationKey =
    SUPABASE_ERROR_TRANSLATION_KEYS[code] ??
    (status ? HTTP_ERROR_TRANSLATION_KEYS[status] : undefined) ??
    DEFAULT_ERROR_TRANSLATION_KEY;

  return {
    code,
    translationKey,
    status,
    retryable:
      status === HTTP_STATUS_CODE.TOO_MANY_REQUESTS ||
      (status !== undefined && status >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR),
  };
};

export const getErrorTranslationKey = (error: unknown): string =>
  normalizeError(error).translationKey;

export const getErrorMessage = (error: unknown, t: TFunction): string => {
  const translationKey =
    typeof error === "string" && error.startsWith("errors.")
      ? error
      : getErrorTranslationKey(error);

  return t(translationKey);
};

export const createDomainError = (code: string): DomainError =>
  Object.assign(new Error(code), {
    name: "DomainError",
    code,
  });
