// ============================================================
// LOGIN PAGE
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// ===== Components, Layouts, Pages=====
import { BaseInput, BaseButton } from "@/components";
import AuthLayout from "../layout/AuthLayout";

// ===== Other =====
import { getRedirectByRole } from "@/router/redirect";
import { Role, InputTypeEnum } from "@/utils/enum";

// ===== Styles, Images, Icons =====
import { icons, images } from "@/assets";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const Login = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ===== State =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== Handlers =====
  const handleLogin = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const role = Role.ADMIN; // fake
      navigate(getRedirectByRole(role));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={cx("container")}>
        {/* ===== Main Card ===== */}
        <div className={cx("card")}>
          {/* ===== Left: Image-Forward Panel ===== */}
          <div className={cx("imagePanel")}>
            <img
              src={images.authIllustrationDashboard}
              alt={t("auth.login.dashboard_alt")}
              className={cx("mainIllustration")}
            />
            <img
              src={images.authIllustrationWidgets}
              alt={t("auth.login.widgets_alt")}
              className={cx("widgetOverlay")}
            />

            <div className={cx("logoBadge")}>
              <div className={cx("formLogo")}>
                <img
                  className={cx("logoIcon")}
                  src={icons.iconLogo}
                  alt={t("auth.login.logo_alt")}
                />
                <h2 className={cx("logoText")}>{t("auth.app_name")}</h2>
              </div>
            </div>
          </div>

          {/* ===== Right: Form ===== */}
          <div className={cx("formPanel")}>
            <div className={cx("formContent")}>
              <div className={cx("formHeader")}>
                <h2 className={cx("formTitle")}>{t("auth.login.title")}</h2>
                <p className={cx("subtitle")}>{t("auth.login.subtitle")}</p>
              </div>

              <form className={cx("formBody")} onSubmit={handleLogin}>
                <div className={cx("inputGroup")}>
                  <BaseInput
                    label={t("auth.login.email")}
                    type={InputTypeEnum.TEXT}
                    placeholder={t("auth.login.email_placeholder")}
                    width="100%"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                <div className={cx("inputGroup")}>
                  <BaseInput
                    label={t("auth.login.password")}
                    type={InputTypeEnum.PASSWORD}
                    placeholder={t("auth.login.password_placeholder")}
                    width="100%"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
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
                  <a href="#" className={cx("forgotLink")}>
                    {t("auth.login.forgot_password")}
                  </a>
                </div>

                <BaseButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  disabled={!email.trim() || !password.trim()}
                >
                  {t("auth.login.submit")}
                </BaseButton>

                <div className={cx("divider")}>
                  <span className={cx("dividerText")}>
                    {t("auth.login.divider")}
                  </span>
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
                      alt=""
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
