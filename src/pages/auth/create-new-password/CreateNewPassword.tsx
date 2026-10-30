// ============================================================
// CREATE NEW PASSWORD PAGE
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

// ===== Components, Layouts, Pages =====
import { BaseButton, BaseInput, BaseToast } from "@/components";
import AuthLayout from "../../../layouts/auth/AuthLayout";

// ===== Others =====
import authApi from "@/features/auth/auth.api";
import {
  authRouteAbsolute,
  EMPTY_STRING,
  PASSWORD_RECOVERY_INVALID_STORAGE_KEY,
  PASSWORD_RECOVERY_PENDING_STORAGE_KEY,
} from "@/utils/constants";
import { InputTypeEnum } from "@/utils/enum";
import {
  createNewPasswordSchema,
  INITIAL_CREATE_NEW_PASSWORD_FORM,
  type CreateNewPasswordFormData,
} from "./CreateNewPassword.schema";
import { getErrorMessage } from "@/utils/errors";

// ===== Styles, Images, Icons =====
import { icons } from "@/assets";
import styles from "./CreateNewPassword.module.scss";

const cx = classNames.bind(styles);

// ===== Helpers =====
const hasInvalidRecoveryLink = () => {
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const errorCode = hashParams.get("error_code");

  return (
    sessionStorage.getItem(PASSWORD_RECOVERY_INVALID_STORAGE_KEY) === "true" ||
    hashParams.get("error") === "access_denied" ||
    errorCode === "otp_expired" ||
    errorCode === "otp_already_used" ||
    errorCode === "token_not_found"
  );
};

// ===== Component =====
const CreateNewPassword = () => {
  // ===== Hooks =====
  const { t, i18n } = useTranslation();
  const createPasswordSchema = useMemo(() => createNewPasswordSchema(t), [t]);

  // ===== State =====
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(EMPTY_STRING);

  // ===== Derived =====
  const isInvalidRecoveryLink = useMemo(hasInvalidRecoveryLink, []);

  // ===== Form =====
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm<CreateNewPasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: INITIAL_CREATE_NEW_PASSWORD_FORM,
    mode: "onChange",
  });

  // ===== Derived =====
  const isDisabled = isLoading || !isValid;

  // ===== Effects =====
  useEffect(() => {
    if (isInvalidRecoveryLink) {
      sessionStorage.setItem(PASSWORD_RECOVERY_INVALID_STORAGE_KEY, "true");
    } else {
      sessionStorage.removeItem(PASSWORD_RECOVERY_INVALID_STORAGE_KEY);
      sessionStorage.setItem(PASSWORD_RECOVERY_PENDING_STORAGE_KEY, "true");
    }

    if (isInvalidRecoveryLink) {
      // Remove Supabase error details from the address bar after reading them.
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [isInvalidRecoveryLink]);

  useEffect(() => {
    const errorFieldNames = Object.keys(errors) as Array<
      keyof CreateNewPasswordFormData
    >;

    if (!errorFieldNames.length) return;

    trigger(errorFieldNames);
  }, [i18n.language, errors, trigger]);

  // ===== Handlers =====
  const handleCreateNewPassword = async (data: CreateNewPasswordFormData) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setErrorMessage(EMPTY_STRING);

      const { error } = await authApi.createNewPassword(data.newPassword);

      if (error) {
        console.error(error.message);
        setErrorMessage(getErrorMessage(error, t));
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error, t));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectLogin = async () => {
    try {
      await authApi.logout();
    } finally {
      sessionStorage.removeItem(PASSWORD_RECOVERY_INVALID_STORAGE_KEY);
      sessionStorage.removeItem(PASSWORD_RECOVERY_PENDING_STORAGE_KEY);
      window.location.replace(authRouteAbsolute.login);
    }
  };

  const handleRequestNewLink = async () => {
    try {
      await authApi.logout();
    } finally {
      sessionStorage.removeItem(PASSWORD_RECOVERY_INVALID_STORAGE_KEY);
      sessionStorage.removeItem(PASSWORD_RECOVERY_PENDING_STORAGE_KEY);
      window.location.replace(authRouteAbsolute.forgotPassword);
    }
  };

  // ===== Render =====
  return (
    <AuthLayout>
      <div className={cx("formContent")}>
        <div className={cx("formHeader")}>
          <h2 className={cx("formTitle")}>
            {isInvalidRecoveryLink
              ? t("auth.create_new_password.invalid_link_title")
              : t("auth.create_new_password.title")}
          </h2>
          <p className={cx("subtitle")}>
            {isInvalidRecoveryLink
              ? t("auth.create_new_password.invalid_link_description")
              : isSubmitted
              ? t("auth.create_new_password.success_message")
              : t("auth.create_new_password.subtitle")}
          </p>
        </div>

        {isInvalidRecoveryLink ? (
          <div className={cx("invalidLinkBox")} role="alert">
            <div className={cx("invalidLinkIcon")}>!</div>
            <p className={cx("invalidLinkText")}>
              {t("auth.create_new_password.invalid_link_help")}
            </p>
            <BaseButton
              type="button"
              variant="primary"
              isFullWidth
              onClick={handleRequestNewLink}
            >
              {t("auth.create_new_password.request_new_link")}
            </BaseButton>
          </div>
        ) : !isSubmitted ? (
          <form
            className={cx("formBody")}
            onSubmit={handleSubmit(handleCreateNewPassword)}
          >
            <div className={cx("inputGroup")}>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <BaseInput
                    label={t("auth.create_new_password.new_password")}
                    type={InputTypeEnum.PASSWORD}
                    placeholder={t(
                      "auth.create_new_password.new_password_placeholder",
                    )}
                    width="100%"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    messageError={
                      touchedFields.newPassword
                        ? errors.newPassword?.message || EMPTY_STRING
                        : EMPTY_STRING
                    }
                    renderPasswordToggle={(isShow) => (
                      <img
                        className={cx("toggleIcon")}
                        src={isShow ? icons.iconEyeOff : icons.iconEyeShow}
                        alt={
                          isShow
                            ? t("auth.create_new_password.hide_password")
                            : t("auth.create_new_password.show_password")
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
                    label={t("auth.create_new_password.confirm_password")}
                    type={InputTypeEnum.PASSWORD}
                    placeholder={t(
                      "auth.create_new_password.confirm_password_placeholder",
                    )}
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
                            ? t("auth.create_new_password.hide_password")
                            : t("auth.create_new_password.show_password")
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
              {t("auth.create_new_password.submit")}
            </BaseButton>
          </form>
        ) : (
          <div className={cx("successBox")}>
            <div className={cx("successIcon")}>✓</div>
            <p className={cx("successText")}>
              {t("auth.create_new_password.success_description")}
            </p>
          </div>
        )}

        <div className={cx("loginRow")}>
          <button
            type="button"
            className={cx("loginLink")}
            onClick={handleRedirectLogin}
          >
            {t("auth.create_new_password.back_to_login")}
          </button>
        </div>
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

export default CreateNewPassword;
