// ============================================================
// FORGOT PASSWORD PAGE
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

// ===== Components, Layouts, Pages =====
import { BaseButton, BaseInput } from "@/components";
import AuthLayout from "../layout/AuthLayout";

// ===== Others =====
import { authRouteAbsolute, EMPTY_STRING } from "@/utils/constants";
import { InputTypeEnum } from "@/utils/enum";
import authApi from "@/features/auth/auth.api";
import {
  createForgotPasswordSchema,
  INITIAL_FORGOT_PASSWORD_FORM,
  type ForgotPasswordFormData,
} from "./ForgotPassword.schema";

// ===== Styles, Images, Icons =====
import styles from "./ForgotPassword.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const ForgotPassword = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const forgotPasswordSchema = useMemo(
    () => createForgotPasswordSchema(t),
    [t],
  );

  // ===== State =====
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ===== Form =====
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: INITIAL_FORGOT_PASSWORD_FORM,
    mode: "onChange",
  });

  // ===== Derived =====
  const isDisabled = isLoading || !isValid;

  // ===== Effects =====
  useEffect(() => {
    const errorFieldNames = Object.keys(errors) as Array<
      keyof ForgotPasswordFormData
    >;

    if (!errorFieldNames.length) return;

    trigger(errorFieldNames);
  }, [i18n.language, errors, trigger]);

  // ===== Handlers =====
  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const { error } = await authApi.forgotPassword(data.email);

      if (error) {
        console.error(error.message);
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectLogin = () => {
    navigate(authRouteAbsolute.login);
  };

  return (
    <AuthLayout>
      <div className={cx("formContent")}>
        <div className={cx("formHeader")}>
          <h2 className={cx("formTitle")}>{t("auth.forgot_password.title")}</h2>
          <p className={cx("subtitle")}>
            {isSubmitted
              ? t("auth.forgot_password.success_message")
              : t("auth.forgot_password.subtitle")}
          </p>
        </div>

        {!isSubmitted ? (
          <form
            className={cx("formBody")}
            onSubmit={handleSubmit(handleForgotPassword)}
          >
            <div className={cx("inputGroup")}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <BaseInput
                    label={t("auth.forgot_password.email")}
                    type={InputTypeEnum.TEXT}
                    placeholder={t("auth.forgot_password.email_placeholder")}
                    width="100%"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    messageError={
                      touchedFields.email
                        ? errors.email?.message || EMPTY_STRING
                        : EMPTY_STRING
                    }
                  />
                )}
              />
            </div>

            <BaseButton
              type="submit"
              variant="primary"
              isFullWidth
              isDisabled={isDisabled}
              isLoading={isLoading}
            >
              {t("auth.forgot_password.submit")}
            </BaseButton>
          </form>
        ) : (
          <div className={cx("successBox")}>
            <div className={cx("successIcon")}>✓</div>
            <p className={cx("successText")}>
              {t("auth.forgot_password.success_description")}
            </p>
          </div>
        )}

        <div className={cx("registerRow")}>
          <span className={cx("registerText")}>
            {t("auth.forgot_password.remember_password")}
          </span>

          <button
            type="button"
            className={cx("registerLink")}
            onClick={handleRedirectLogin}
          >
            {t("auth.forgot_password.back_to_login")}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
