// ============================================================
// REGISTER SCHEMA
// ============================================================

// ===== Libs =====
import type { TFunction } from "i18next";
import { z } from "zod";

// ===== Others =====
import { EMPTY_STRING } from "@/utils/constants";

// ===== Fields =====
const REGISTER_FIELDS = {
  FULL_NAME: "fullName",
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
} as const;

// ===== Schema =====
export const createRegisterSchema = (t: TFunction) =>
  z
    .object({
      [REGISTER_FIELDS.FULL_NAME]: z
        .string()
        .trim()
        .min(1, t("auth.validation.full_name_required")),
      [REGISTER_FIELDS.EMAIL]: z
        .string()
        .trim()
        .min(1, t("auth.validation.email_required"))
        .email(t("auth.validation.invalid_email")),
      [REGISTER_FIELDS.PASSWORD]: z
        .string()
        .min(1, t("auth.validation.password_required"))
        .min(8, t("auth.validation.password_min_length")),
      [REGISTER_FIELDS.CONFIRM_PASSWORD]: z
        .string()
        .min(1, t("auth.validation.confirm_password_required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: [REGISTER_FIELDS.CONFIRM_PASSWORD],
      message: t("auth.validation.password_not_match"),
    });

// ===== Types =====
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

// ===== Constants =====
export const INITIAL_REGISTER_FORM: RegisterFormData = {
  fullName: EMPTY_STRING,
  email: EMPTY_STRING,
  password: EMPTY_STRING,
  confirmPassword: EMPTY_STRING,
};
