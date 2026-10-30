// ============================================================
// CREATE NEW PASSWORD SCHEMA
// ============================================================

// ===== Libs =====
import type { TFunction } from "i18next";
import { z } from "zod";

// ===== Others =====
import { EMPTY_STRING } from "@/utils/constants";

// ===== Fields =====
const CREATE_NEW_PASSWORD_FIELDS = {
  NEW_PASSWORD: "newPassword",
  CONFIRM_PASSWORD: "confirmPassword",
} as const;

// ===== Schema =====
export const createNewPasswordSchema = (t: TFunction) =>
  z
    .object({
      [CREATE_NEW_PASSWORD_FIELDS.NEW_PASSWORD]: z
        .string()
        .trim()
        .min(1, t("auth.validation.password_required"))
        .min(8, t("auth.validation.password_min_length")),

      [CREATE_NEW_PASSWORD_FIELDS.CONFIRM_PASSWORD]: z
        .string()
        .trim()
        .min(1, t("auth.validation.confirm_password_required")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.validation.confirm_password_not_match"),
      path: [CREATE_NEW_PASSWORD_FIELDS.CONFIRM_PASSWORD],
    });

// ===== Types =====
export type CreateNewPasswordFormData = z.infer<
  ReturnType<typeof createNewPasswordSchema>
>;

// ===== Constants =====
export const INITIAL_CREATE_NEW_PASSWORD_FORM: CreateNewPasswordFormData = {
  newPassword: EMPTY_STRING,
  confirmPassword: EMPTY_STRING,
};
