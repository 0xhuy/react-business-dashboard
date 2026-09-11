// ===== Libs =====
import { Navigate, Outlet, useLocation } from "react-router-dom";

// ===== Hooks =====
import { useAppSelector } from "@/redux/hooks";

// ===== Others =====
import {
  authRouteAbsolute,
  PASSWORD_RECOVERY_PENDING_STORAGE_KEY,
} from "@/utils/constants";
import { Role } from "@/utils/enum";
import { BaseLoading } from "@/components";

// ===== Component =====
export const ProtectedRoute = () => {
  // ===== Hooks =====
  const location = useLocation();
  // ===== Selectors =====
  const session = useAppSelector((state) => state.auth.session);
  const role = useAppSelector((state) => state.auth.role) as Role | null;
  const loading = useAppSelector((state) => state.auth.loading);

  // ===== Render =====
  if (loading) {
    return <BaseLoading variant="page" size="lg" />;
  }

  if (!session || !role) {
    return (
      <Navigate
        to={authRouteAbsolute.login}
        state={{ from: location }}
        replace
      />
    );
  }

  const isPasswordRecoveryPending =
    sessionStorage.getItem(PASSWORD_RECOVERY_PENDING_STORAGE_KEY) === "true";

  if (isPasswordRecoveryPending) {
    return <Navigate to={authRouteAbsolute.createNewPassword} replace />;
  }

  return <Outlet />;
};
