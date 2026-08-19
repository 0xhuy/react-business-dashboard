import type {
  UserRole,
  UserRow,
  UserStatus,
} from "@/features/users/user.types";

export type { UserRole, UserRow, UserStatus };

export type UserFilterValues = {
  role?: UserRole | "all" | "";
  status?: UserStatus | "all" | "";
};
