// ============================================================
// DEFAULT VALUES
// ============================================================
export const ASTERISK_SYMBOL = "*";
export const EMPTY_STRING = "";
export const ROOT_PATH = "/";
export const MAX_WIDTH_PERCENT = "100%";
export const MAX_HEIGHT_PERCENT = "100%";
export const DOLLAR_SYMBOL = "$";
export const MAX_ROW_QUANTITY = 200;
export const PLUS_SYMBOL = "+";
export const DEFAULT_CURRENCY = "USD";
export const TABLET_VIEWPORT_QUERY = "(max-width: 1024px)";
export const HTTP_STATUS_CODE = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ============================================================
// NUMBERS
// ============================================================
export const DEFAULT_NUMBER_ZERO = 0;
export const DEFAULT_MODAL_WIDTH = 720;

// ============================================================
// UNITS
// ============================================================
export const PIXELS = "px";

// ============================================================
// REGEX
// ============================================================
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const LEADING_ZERO_REGEX = /^0+(?=\d)/;

// ============================================================
// SYMBOLS
// ============================================================
export const SYMBOL_THREE_DOTS = "•••";
