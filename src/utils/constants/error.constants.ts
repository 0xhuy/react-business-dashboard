import { HTTP_STATUS_CODE } from "./common";

export const ERROR_CODE = {
  UNKNOWN: "UNKNOWN_ERROR",
  NETWORK: "NETWORK_ERROR",
  CURRENT_PASSWORD_INCORRECT: "CURRENT_PASSWORD_INCORRECT",
} as const;

export const ABORT_ERROR_NAME = "AbortError";
export const NETWORK_ERROR_PATTERN =
  /failed to fetch|networkerror|load failed|fetch failed/i;

export const SUPABASE_ERROR_TRANSLATION_KEYS: Record<string, string> = {
  // Auth
  invalid_credentials: "errors.auth.invalid_credentials",
  email_not_confirmed: "errors.auth.email_not_confirmed",
  user_already_exists: "errors.auth.user_already_exists",
  email_exists: "errors.auth.user_already_exists",
  weak_password: "errors.auth.weak_password",
  same_password: "errors.auth.same_password",
  [ERROR_CODE.CURRENT_PASSWORD_INCORRECT]:
    "errors.auth.current_password_incorrect",
  over_request_rate_limit: "errors.rate_limited",
  over_email_send_rate_limit: "errors.rate_limited",
  session_not_found: "errors.auth.session_expired",
  refresh_token_not_found: "errors.auth.session_expired",
  refresh_token_already_used: "errors.auth.session_expired",

  // Postgres / PostgREST
  "23505": "errors.database.duplicate",
  "23503": "errors.database.referenced_record",
  "23502": "errors.database.required_value",
  "22P02": "errors.database.invalid_value",
  "42501": "errors.forbidden",
  PGRST116: "errors.not_found",
};

export const HTTP_ERROR_TRANSLATION_KEYS: Record<number, string> = {
  [HTTP_STATUS_CODE.BAD_REQUEST]: "errors.bad_request",
  [HTTP_STATUS_CODE.UNAUTHORIZED]: "errors.auth.session_expired",
  [HTTP_STATUS_CODE.FORBIDDEN]: "errors.forbidden",
  [HTTP_STATUS_CODE.NOT_FOUND]: "errors.not_found",
  [HTTP_STATUS_CODE.CONFLICT]: "errors.conflict",
  [HTTP_STATUS_CODE.UNPROCESSABLE_CONTENT]: "errors.validation",
  [HTTP_STATUS_CODE.TOO_MANY_REQUESTS]: "errors.rate_limited",
  [HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR]: "errors.server",
  [HTTP_STATUS_CODE.BAD_GATEWAY]: "errors.server",
  [HTTP_STATUS_CODE.SERVICE_UNAVAILABLE]: "errors.server",
  [HTTP_STATUS_CODE.GATEWAY_TIMEOUT]: "errors.server",
};

export const DEFAULT_ERROR_TRANSLATION_KEY = "errors.unknown";
export const NETWORK_ERROR_TRANSLATION_KEY = "errors.network";
