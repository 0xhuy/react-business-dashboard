import { Role } from "@/utils/enum/role.enum";

export const getRedirectByRole = (role: Role) => {
  switch (role) {
    case Role.ADMIN:
      return "/admin/dashboard";

    case Role.STAFF:
      return "/staff/dashboard";

    case Role.VIEWER:
      return "/viewer/dashboard";

    default:
      return "/login";
  }
};
