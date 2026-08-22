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

export type UserFilterValues = {
  role?: UserRole | "all" | "";
  status?: UserStatus | "all" | "";
};

export type UserFormValues = UserMutationPayload & {
  password: string;
  confirmPassword: string;
};

export type UserFormInitialValues = Omit<
  UserFormValues,
  "password" | "confirmPassword"
>;
