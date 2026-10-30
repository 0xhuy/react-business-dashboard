import {
  adminRouteAbsolute,
  authRouteAbsolute,
  staffRouteAbsolute,
  viewerRouteAbsolute,
} from "@/utils/constants";
import { Role } from "@/utils/enum/role.enum";

// ============================================================
// GET REDIRECT PATH BY ROLE
// ============================================================
export const getRedirectByRole = (role: Role) => {
  switch (role) {
    case Role.ADMIN:
      return adminRouteAbsolute.dashboard;

    case Role.STAFF:
      return staffRouteAbsolute.dashboard;

    case Role.VIEWER:
      return viewerRouteAbsolute.dashboard;

    default:
      return authRouteAbsolute.login;
  }
};
