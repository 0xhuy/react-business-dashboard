// ============================================================
// LOGIN PAGE
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ===== Components, Layouts, Pages=====
import { BaseInput, BaseButton, BaseToast } from "@/components";
import { AuthLayout } from "@/layouts";

// ===== Other =====
import { authRouteAbsolute, EMPTY_STRING } from "@/utils/constants";
import { getRedirectByRole } from "@/router/redirect";
import { InputTypeEnum } from "@/utils/enum";
import {
  createLoginSchema,
  INITIAL_LOGIN_FORM,
  type LoginFormData,
} from "./Login.schema";
import authApi from "@/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import { getAuthThunk } from "@/redux/thunks/auth/authThunk";
import { getErrorMessage } from "@/utils/errors";

// ===== Styles, Images, Icons =====
import { icons } from "@/assets";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const Login = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  // ===== State =====
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(EMPTY_STRING);
  const [successMessage, setSuccessMessage] = useState(EMPTY_STRING);

  // ===== Form =====
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
    mode: "onChange",
  });

  // ===== Derived =====
  const isDisabled = isLoading || !isValid;

  // ===== Effects =====
  useEffect(() => {
    const errorFieldNames = Object.keys(errors) as Array<keyof LoginFormData>;

    if (!errorFieldNames.length) return;

    trigger(errorFieldNames);
  }, [i18n.language, errors, trigger]);

  useEffect(() => {
    const state = location.state as { registrationSuccess?: boolean } | null;

    if (!state?.registrationSuccess) return;

    setSuccessMessage(t("auth.register.success_message"));
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, t]);

  // ===== Handlers =====
  const handleLogin = async (data: LoginFormData) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setErrorMessage(EMPTY_STRING);

      const { data: authData, error } = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error(error.message);
        setErrorMessage(getErrorMessage(error, t));
        return;
      }

      const { role, isInactive } = await dispatch(
        getAuthThunk(authData.session ?? undefined),
      ).unwrap();

      if (isInactive) {
        setErrorMessage(t("auth.errors.account_inactive"));
        return;
      }

      if (!role) return;

      navigate(getRedirectByRole(role));
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error, t));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectRegister = () => {
    navigate(authRouteAbsolute.register);
  };

  return (
    <AuthLayout>
      <div className={cx("formContent")}>
        <div className={cx("formHeader")}>
          <h2 className={cx("formTitle")}>{t("auth.login.title")}</h2>
          <p className={cx("subtitle")}>{t("auth.login.subtitle")}</p>
        </div>

        <form className={cx("formBody")} onSubmit={handleSubmit(handleLogin)}>
          <div className={cx("inputGroup")}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <BaseInput
                  label={t("auth.login.email")}
                  type={InputTypeEnum.TEXT}
                  placeholder={t("auth.login.email_placeholder")}
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
                  label={t("auth.login.password")}
                  type={InputTypeEnum.PASSWORD}
                  placeholder={t("auth.login.password_placeholder")}
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
                          ? t("auth.login.hide_password")
                          : t("auth.login.show_password")
                      }
                    />
                  )}
                />
              )}
            />
          </div>

          <div className={cx("formOptions")}>
            <label className={cx("rememberMe")}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={cx("checkbox")}
              />
              <span className={cx("checkboxCustom")} />
              <span className={cx("rememberText")}>
                {t("auth.login.remember_me")}
              </span>
            </label>

            <button
              type="button"
              className={cx("forgotLink")}
              onClick={() => navigate(authRouteAbsolute.forgotPassword)}
            >
              {t("auth.login.forgot_password")}
            </button>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            isFullWidth
            isDisabled={isDisabled}
            isLoading={isLoading}
          >
            {t("auth.login.submit")}
          </BaseButton>

          <div className={cx("divider")}>
            <span className={cx("dividerText")}>{t("auth.login.divider")}</span>
          </div>

          <div className={cx("socialRow")}>
            <button
              className={cx("socialBtn")}
              type="button"
              aria-label={t("auth.login.google_login")}
            >
              <img
                className={cx("iconGoogleLogin")}
                src={icons.iconGoogleLogin}
                alt={EMPTY_STRING}
              />
            </button>
          </div>

          <div className={cx("registerRow")}>
            <span className={cx("registerText")}>
              {t("auth.login.no_account")}
            </span>

            <button
              type="button"
              className={cx("registerLink")}
              onClick={handleRedirectRegister}
            >
              {t("auth.login.register")}
            </button>
          </div>
        </form>
      </div>

      <BaseToast
        isOpen={Boolean(errorMessage || successMessage)}
        message={errorMessage || successMessage}
        variant={errorMessage ? "error" : "success"}
        onClose={() => {
          setErrorMessage(EMPTY_STRING);
          setSuccessMessage(EMPTY_STRING);
        }}
      />
    </AuthLayout>
  );
};

export default Login;
