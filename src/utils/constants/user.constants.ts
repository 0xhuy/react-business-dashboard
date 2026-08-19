// ===== Others =====
import type { UserFormValues } from "@/pages/users/components/UsersFormModal/types";
import type { UserFilterValues } from "@/pages/users/type";
import {
  ProfileStatusEnum,
  Role,
  UserRoleEnum,
  UserStatusEnum,
} from "@/utils/enum";

export const PROFILE_ROLE_TO_USER_ROLE = {
  [Role.ADMIN]: UserRoleEnum.ADMIN,
  [Role.STAFF]: UserRoleEnum.STAFF,
  [Role.VIEWER]: UserRoleEnum.VIEWER,
} as const;

export const USER_ROLE_TO_PROFILE_ROLE = {
  [UserRoleEnum.ADMIN]: Role.ADMIN,
  [UserRoleEnum.STAFF]: Role.STAFF,
  [UserRoleEnum.VIEWER]: Role.VIEWER,
} as const;

export const PROFILE_STATUS_TO_USER_STATUS = {
  [ProfileStatusEnum.ACTIVE]: UserStatusEnum.ACTIVE,
  [ProfileStatusEnum.INACTIVE]: UserStatusEnum.INACTIVE,
} as const;

export const USER_STATUS_TO_PROFILE_STATUS = {
  [UserStatusEnum.ACTIVE]: ProfileStatusEnum.ACTIVE,
  [UserStatusEnum.INACTIVE]: ProfileStatusEnum.INACTIVE,
} as const;

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
    label: UserRoleEnum.ADMIN,
    value: UserRoleEnum.ADMIN,
  },
  {
    label: UserRoleEnum.STAFF,
    value: UserRoleEnum.STAFF,
  },
  {
    label: UserRoleEnum.VIEWER,
    value: UserRoleEnum.VIEWER,
  },
];

export const DEFAULT_USER_FORM_VALUES: UserFormValues = {
  fullName: "",
  email: "",
  role: UserRoleEnum.STAFF,
  status: UserStatusEnum.ACTIVE,
  password: "",
  confirmPassword: "",
};

export const USER_STATUS_OPTIONS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: UserStatusEnum.ACTIVE,
    value: UserStatusEnum.ACTIVE,
  },
  {
    label: UserStatusEnum.INACTIVE,
    value: UserStatusEnum.INACTIVE,
  },
];
