// ============================================================
// PROTECTED ROUTE
// ============================================================

// ===== Libs =====
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

// ===== Others =====
import authApi from "@/features/auth/auth.api";
import { authRouteAbsolute } from "@/utils/constants";
import { Role } from "@/utils/enum";
import { getRedirectByRole } from "./redirect";

// ===== Types =====
type ProtectedRouteProps = {
  allow: Role[];
};

// ===== Component =====
export const ProtectedRoute = ({ allow }: ProtectedRouteProps) => {
  // ===== State =====
  const [role, setRole] = useState<Role | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ===== Effects =====
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const { data, error } = await authApi.getSession();

        if (error || !data.session?.user) {
          setRole(null);
          return;
        }

        const userRole = data.session.user.user_metadata?.role as
          | Role
          | undefined;

        setRole(userRole || Role.VIEWER);
      } catch (error) {
        console.error(error);
        setRole(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthSession();
  }, []);

  // ===== Render =====
  if (isCheckingAuth) {
    return null;
  }

  if (!role) {
    return <Navigate to={authRouteAbsolute.login} replace />;
  }

  if (!allow.includes(role)) {
    return <Navigate to={getRedirectByRole(role)} replace />;
  }

  return <Outlet />;
};
