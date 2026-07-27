// ===== Others =====
import type { UserFormValues } from "@/pages/users/components/UsersFormModal/types";
import type { UserFilterValues, UserRow } from "@/pages/users/type";

export const DEFAULT_USER_FILTER_VALUES: UserFilterValues = {
  role: "",
  status: "",
};

export const USER_ROLE_OPTIONS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "Manager",
    value: "Manager",
  },
  {
    label: "Staff",
    value: "Staff",
  },
];

export const DEFAULT_USER_FORM_VALUES: UserFormValues = {
  fullName: "",
  email: "",
  role: "Staff",
  status: "Active",
  password: "",
  confirmPassword: "",
};

export const USER_STATUS_OPTIONS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Inactive",
    value: "Inactive",
  },
];

export const USER_DATA_SOURCE: UserRow[] = [
  {
    id: "USR-001",
    fullName: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2026-07-01",
  },
  {
    id: "USR-002",
    fullName: "John Manager",
    email: "john.manager@example.com",
    role: "Manager",
    status: "Active",
    createdAt: "2026-07-05",
  },
  {
    id: "USR-003",
    fullName: "Anna Staff",
    email: "anna.staff@example.com",
    role: "Staff",
    status: "Active",
    createdAt: "2026-07-10",
  },
  {
    id: "USR-004",
    fullName: "David Staff",
    email: "david.staff@example.com",
    role: "Staff",
    status: "Inactive",
    createdAt: "2026-07-12",
  },
  {
    id: "USR-005",
    fullName: "Emily Manager",
    email: "emily.manager@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2026-07-18",
  },
];
