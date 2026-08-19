// ============================================================
// REGISTER PAGE
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

// ===== Components, Layouts, Pages =====
import { BaseButton, BaseInput, BaseToast } from "@/components";
import { AuthLayout } from "@/layouts";

// ===== Others =====
import { InputTypeEnum } from "@/utils/enum";
import { authRouteAbsolute, EMPTY_STRING } from "@/utils/constants";
import authApi from "@/features/auth/auth.api";
import {
  createRegisterSchema,
  INITIAL_REGISTER_FORM,
  type RegisterFormData,
} from "./Register.schema";

// ===== Styles, Images, Icons =====
import { icons } from "@/assets";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const Register = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // ===== State =====
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(EMPTY_STRING);

  // ===== Memo =====
  const registerSchema = useMemo(() => createRegisterSchema(t), [t]);

  // ===== Form =====
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: INITIAL_REGISTER_FORM,
    mode: "onChange",
  });

  // ===== Derived =====
  const isDisabled = isLoading || !isValid;
  const passwordValue = watch("password");

  // ===== Effects =====
  useEffect(() => {
    const errorFieldNames = Object.keys(errors) as Array<
      keyof RegisterFormData
    >;

    if (!errorFieldNames.length) return;

    trigger(errorFieldNames);
  }, [i18n.language, errors, trigger]);

  useEffect(() => {
    if (!touchedFields.confirmPassword) return;

    trigger("confirmPassword");
  }, [passwordValue, touchedFields.confirmPassword, trigger]);

  // ===== Handlers =====
  const handleRegister = async (data: RegisterFormData) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setErrorMessage(EMPTY_STRING);

      const { error } = await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error(error.message);
        setErrorMessage(t("auth.errors.register_failed"));
        return;
      }

      navigate(authRouteAbsolute.login, {
        state: { registrationSuccess: true },
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(t("auth.errors.register_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectLogin = () => {
    navigate(authRouteAbsolute.login);
  };

  // ===== Render =====
  return (
    <AuthLayout>
      <div className={cx("formContent")}>
        <div className={cx("formHeader")}>
          <h2 className={cx("formTitle")}>{t("auth.register.title")}</h2>
          <p className={cx("subtitle")}>{t("auth.register.subtitle")}</p>
        </div>

        <form
          className={cx("formBody")}
          onSubmit={handleSubmit(handleRegister)}
        >
          <div className={cx("inputGroup")}>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <BaseInput
                  label={t("auth.register.full_name")}
                  type={InputTypeEnum.TEXT}
                  placeholder={t("auth.register.full_name_placeholder")}
                  width="100%"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  messageError={
                    touchedFields.fullName
                      ? errors.fullName?.message || EMPTY_STRING
                      : EMPTY_STRING
                  }
                />
              )}
            />
          </div>

          <div className={cx("inputGroup")}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <BaseInput
                  label={t("auth.register.email")}
                  type={InputTypeEnum.TEXT}
                  placeholder={t("auth.register.email_placeholder")}
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

          <div className={cx("inputGroup")}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <BaseInput
                  label={t("auth.register.password")}
                  type={InputTypeEnum.PASSWORD}
                  placeholder={t("auth.register.password_placeholder")}
                  width="100%"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  messageError={
                    touchedFields.password
                      ? errors.password?.message || EMPTY_STRING
                      : EMPTY_STRING
                  }
                  renderPasswordToggle={(isShow) => (
                    <img
                      className={cx("toggleIcon")}
                      src={isShow ? icons.iconEyeOff : icons.iconEyeShow}
                      alt={
                        isShow
                          ? t("auth.register.hide_password")
                          : t("auth.register.show_password")
                      }
                    />
                  )}
                />
              )}
            />
          </div>

          <div className={cx("inputGroup")}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <BaseInput
                  label={t("auth.register.confirm_password")}
                  type={InputTypeEnum.PASSWORD}
                  placeholder={t("auth.register.confirm_password_placeholder")}
                  width="100%"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  messageError={
                    touchedFields.confirmPassword
                      ? errors.confirmPassword?.message || EMPTY_STRING
                      : EMPTY_STRING
                  }
                  renderPasswordToggle={(isShow) => (
                    <img
                      className={cx("toggleIcon")}
                      src={isShow ? icons.iconEyeOff : icons.iconEyeShow}
                      alt={
                        isShow
                          ? t("auth.register.hide_password")
                          : t("auth.register.show_password")
                      }
                    />
                  )}
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
            {t("auth.register.submit")}
          </BaseButton>

          <div className={cx("loginRow")}>
            <span className={cx("loginText")}>
              {t("auth.register.has_account")}
            </span>

            <button
              type="button"
              className={cx("loginLink")}
              onClick={handleRedirectLogin}
            >
              {t("auth.register.login")}
            </button>
          </div>
        </form>
      </div>

      <BaseToast
        isOpen={Boolean(errorMessage)}
        message={errorMessage}
        variant="error"
        onClose={() => setErrorMessage(EMPTY_STRING)}
      />
    </AuthLayout>
  );
};

export default Register;
