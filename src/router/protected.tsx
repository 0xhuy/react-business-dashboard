// ===== Libs =====
import { Navigate, Outlet, useLocation } from "react-router-dom";

// ===== Hooks =====
import { useAppSelector } from "@/redux/hooks";

// ===== Others =====
import { authRouteAbsolute } from "@/utils/constants";
import { Role } from "@/utils/enum";

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
    return null;
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

  return <Outlet />;
};
