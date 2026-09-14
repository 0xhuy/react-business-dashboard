import type { UserRoleEnum, UserStatusEnum } from "@/utils/enum";

export type UserRole = UserRoleEnum;

export type UserStatus = UserStatusEnum;

export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type UserMutationPayload = {
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export type UserFilterValues = {
  role?: UserRole | "all" | "";
  status?: UserStatus | "all" | "";
};
