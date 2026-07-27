// ===== Libs =====
import type { TFunction } from "i18next";
import { z } from "zod";

// ===== Others =====
import { UserRoleEnum, UserStatusEnum } from "@/utils/enum";

// ===== Schema =====
export const userFormSchema = (t: TFunction, isEdit = false) =>
  z
    .object({
      fullName: z.string().trim().min(1, t("common.required")),

      email: z
        .string()
        .trim()
        .min(1, t("common.required"))
        .email(t("common.invalid_email")),

      role: z.nativeEnum(UserRoleEnum),

      status: z.nativeEnum(UserStatusEnum),

      password: isEdit
        ? z.string().optional()
        : z
            .string()
            .trim()
            .min(6, t("common.min_length", { value: 6 })),

      confirmPassword: isEdit
        ? z.string().optional()
        : z.string().trim().min(1, t("common.required")),
    })
    .refine((data) => isEdit || data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("common.password_not_match"),
    });

// ===== Types =====
export type UserFormSchema = z.infer<ReturnType<typeof userFormSchema>>;
