// ===== Libs =====
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

// ===== Others =====
import { authRouteAbsolute } from "@/utils/constants";
import { Role } from "@/utils/enum/role.enum";
import { getRedirectByRole } from "./redirect";

// ===== Component =====
export const PublicRoute = () => {
  // ===== Hooks =====
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname;
  // ===== Selectors =====
  const session = useAppSelector((state) => state.auth.session);
  const role = useAppSelector((state) => state.auth.role) as Role | null;
  const loading = useAppSelector((state) => state.auth.loading);

  // ===== Render =====
  if (loading) {
    return null;
  }

  const isCreateNewPasswordRoute =
    location.pathname === authRouteAbsolute.createNewPassword;

  if (session && role && !isCreateNewPasswordRoute) {
    return <Navigate to={redirectPath || getRedirectByRole(role)} replace />;
  }

  return <Outlet />;
};
