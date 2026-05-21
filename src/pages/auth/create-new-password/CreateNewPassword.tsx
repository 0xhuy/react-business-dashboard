// ============================================================
// CREATE NEW PASSWORD PAGE
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
import authApi from "@/features/auth/auth.api";
import { authRouteAbsolute, EMPTY_STRING } from "@/utils/constants";
import { InputTypeEnum } from "@/utils/enum";
import {
  createNewPasswordSchema,
  INITIAL_CREATE_NEW_PASSWORD_FORM,
  type CreateNewPasswordFormData,
} from "./CreateNewPassword.schema";

// ===== Styles, Images, Icons =====
import { icons } from "@/assets";
import styles from "./CreateNewPassword.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const CreateNewPassword = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const createPasswordSchema = useMemo(() => createNewPasswordSchema(t), [t]);

  // ===== State =====
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

      const { error } = await authApi.createNewPassword(data.newPassword);

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

  // ===== Render =====
  return (
    <AuthLayout>
      <div className={cx("formContent")}>
        <div className={cx("formHeader")}>
          <h2 className={cx("formTitle")}>
            {t("auth.create_new_password.title")}
          </h2>
          <p className={cx("subtitle")}>
            {isSubmitted
              ? t("auth.create_new_password.success_message")
              : t("auth.create_new_password.subtitle")}
          </p>
        </div>

        {!isSubmitted ? (
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
    </AuthLayout>
  );
};

export default CreateNewPassword;
