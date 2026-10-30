// ============================================================
// LOGIN SCHEMA
// ============================================================

// ===== Libs =====
import type { TFunction } from "i18next";
import { z } from "zod";

// ===== Others =====
import { EMPTY_STRING } from "@/utils/constants";

// ===== Fields =====
const LOGIN_FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
} as const;

// ===== Schema =====
export const createLoginSchema = (t: TFunction) =>
  z.object({
    [LOGIN_FIELDS.EMAIL]: z
      .string()
      .trim()
      .min(1, t("auth.validation.email_required"))
      .email(t("auth.validation.invalid_email")),
    [LOGIN_FIELDS.PASSWORD]: z
      .string()
      .min(1, t("auth.validation.password_required")),
  });

// ===== Types =====
export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

// ===== Constants =====
export const INITIAL_LOGIN_FORM: LoginFormData = {
  email: EMPTY_STRING,
  password: EMPTY_STRING,
};
