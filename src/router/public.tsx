// ============================================================
// PUBLIC ROUTE
// ============================================================

// ===== Libs =====
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

// ===== Others =====
import { Role } from "@/utils/enum/role.enum";
import { getRedirectByRole } from "./redirect";

// ===== Component =====
export const PublicRoute = () => {
  // ===== Selectors =====
  const session = useAppSelector((state) => state.auth.session);
  const role = useAppSelector((state) => state.auth.role) as Role | null;
  const loading = useAppSelector((state) => state.auth.loading);

  // ===== Render =====
  if (loading) {
    return null;
  }

  if (session && role) {
    return <Navigate to={getRedirectByRole(role)} replace />;
  }

  return <Outlet />;
};
