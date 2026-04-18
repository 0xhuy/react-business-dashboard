// ===== Libs =====
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// ===== Components, Layouts, Pages=====
import BaseInput from "@/components/base/input/BaseInput";

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

  // ===== State =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== Handlers =====
  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const role = Role.ADMIN; // fake
    navigate(getRedirectByRole(role));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className={cx("container")}>
      {/* ===== Main Card ===== */}
      <div className={cx("card")}>
        {/* ===== Left: Image-Forward Panel ===== */}
        <div className={cx("imagePanel")}>
          <img
            src={images.authIllustrationDashboard}
            alt="Dashboard"
            className={cx("mainIllustration")}
          />
          <img
            src={images.authIllustrationWidgets}
            alt="Widgets"
            className={cx("widgetOverlay")}
          />

          <div className={cx("logoBadge")}>
            <div className={cx("formLogo")}>
              <img
                className={cx("logoIcon")}
                src={icons.iconLogo}
                alt="Dashly logo"
              />
              <h2 className={cx("logoText")}>Dashly</h2>
            </div>
          </div>
        </div>

        {/* ===== Right: Form ===== */}
        <div className={cx("formPanel")}>
          <div className={cx("formContent")}>
            <div className={cx("formHeader")}>
              <h2 className={cx("formTitle")}>Welcome back</h2>
              <p className={cx("subtitle")}>
                Sign in to continue to your dashboard
              </p>
            </div>

            <div className={cx("formBody")} onKeyDown={handleKeyDown}>
              <div className={cx("inputGroup")}>
                <BaseInput
                  label="Email"
                  type={InputTypeEnum.TEXT}
                  placeholder="name@company.com"
                  width="100%"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className={cx("inputGroup")}>
                <BaseInput
                  label="Password"
                  type={InputTypeEnum.PASSWORD}
                  placeholder="Enter your password"
                  width="100%"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  renderPasswordToggle={(isShow) => (
                    <img
                      className={cx("toggleIcon")}
                      src={isShow ? icons.iconEyeOff : icons.iconEyeShow}
                      alt="toggle"
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
                  <span className={cx("rememberText")}>Remember me</span>
                </label>
                <a href="#" className={cx("forgotLink")}>
                  Forgot password?
                </a>
              </div>

              <button
                className={cx("loginButton", { loading: isLoading })}
                onClick={handleLogin}
                disabled={isLoading}
              >
                <span className={cx("btnContent")}>
                  {isLoading ? <div className={cx("spinner")} /> : <>Sign In</>}
                </span>
              </button>

              <div className={cx("divider")}>
                <span className={cx("dividerText")}>Or</span>
              </div>

              <div className={cx("socialRow")}>
                <button
                  className={cx("socialBtn")}
                  type="button"
                  aria-label="Sign in with Google"
                >
                  <img
                    className={cx("iconGoogleLogin")}
                    src={icons.iconGoogleLogin}
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
