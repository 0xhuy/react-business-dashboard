// ===== Libs =====
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

// ===== Utils =====
import { Role } from "@/utils/enum/role.enum";

// ===== Router =====
import { getRedirectByRole } from "@/router/redirect";

// ===== Styles =====
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const role = Role.ADMIN; // fake

    navigate(getRedirectByRole(role));
  };

  return (
    <div className={cx("container")}>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
