export type UserRole = "Admin" | "Manager" | "Staff";

export type UserStatus = "Active" | "Inactive";

export type UserFormValues = {
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password: string;
  confirmPassword: string;
};

export type UserFormInitialValues = Omit<
  UserFormValues,
  "password" | "confirmPassword"
>;

export type UserFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  initialValues?: UserFormInitialValues;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => void;
};
