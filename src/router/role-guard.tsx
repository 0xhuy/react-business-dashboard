// ===== Libs =====
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

// ===== Others =====
import { useAppSelector } from "@/redux/hooks";
import type { Role } from "@/utils/enum/role.enum";
import { getRedirectByRole } from "./redirect";

// ===== Types =====
type RoleGuardProps = {
  allow: Role[];
  children: ReactNode;
};

// ===== Component =====
export const RoleGuard = (props: RoleGuardProps) => {
  // ===== Props =====
  const { allow, children } = props;

  // ===== Selectors =====
  const role = useAppSelector((state) => state.auth.role);

  if (!role) {
    return null;
  }

  if (!allow.includes(role)) {
    return <Navigate to={getRedirectByRole(role)} replace />;
  }

  return children;
};
