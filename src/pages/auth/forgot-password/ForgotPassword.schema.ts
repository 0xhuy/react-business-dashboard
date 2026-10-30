// ============================================================
// FORGOT PASSWORD SCHEMA
// ============================================================

// ===== Libs =====
import type { TFunction } from 'i18next';
import { z } from 'zod';

// ===== Others =====
import { EMPTY_STRING } from '@/utils/constants';

// ===== Fields =====
const FORGOT_PASSWORD_FIELDS = {
  EMAIL: 'email',
} as const;

// ===== Schema =====
export const createForgotPasswordSchema = (t: TFunction) =>
  z.object({
    [FORGOT_PASSWORD_FIELDS.EMAIL]: z
      .string()
      .trim()
      .min(1, t('auth.validation.email_required'))
      .email(t('auth.validation.invalid_email')),
  });

// ===== Types =====
export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

// ===== Constants =====
export const INITIAL_FORGOT_PASSWORD_FORM: ForgotPasswordFormData = {
  email: EMPTY_STRING,
};
