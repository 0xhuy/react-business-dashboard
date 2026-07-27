export type UserRole = "Admin" | "Manager" | "Staff";

export type UserStatus = "Active" | "Inactive";

export type UserFilterValues = {
  role?: UserRole | "all" | "";
  status?: UserStatus | "all" | "";
};

export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};
