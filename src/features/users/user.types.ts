export type UserRole = "Admin" | "Staff" | "Viewer";

export type UserStatus = "Active" | "Inactive";

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
