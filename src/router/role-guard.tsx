// ===== Libs =====
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

// ===== Others =====
import { useAppSelector } from "@/redux/hooks";
import { Role } from "@/utils/enum/role.enum";
import { getRedirectByRole } from "./redirect";

// ===== Types =====
type Props = {
  allow: Role[];
  children: ReactNode;
};

// ===== Component =====
export const RoleGuard = (props: Props) => {
  // ===== Props =====
  const { allow, children } = props;

  // ===== Selectors =====
  const role = useAppSelector((state) => state.auth.role) as Role | null;

  if (!role) {
    return null;
  }

  if (!allow.includes(role)) {
    return <Navigate to={getRedirectByRole(role)} replace />;
  }

  return children;
};
