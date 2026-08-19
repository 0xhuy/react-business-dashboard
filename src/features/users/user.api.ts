import { supabase } from "@/services/supabase";
import type {
  UserMutationPayload,
  UserRole,
  UserRow,
  UserStatus,
} from "./user.types";
import {
  PROFILE_ROLE_TO_USER_ROLE,
  PROFILE_STATUS_TO_USER_STATUS,
  USER_ROLE_TO_PROFILE_ROLE,
  USER_STATUS_TO_PROFILE_STATUS,
} from "@/utils/constants";
import { ProfileStatusEnum, Role, UserRoleEnum, UserStatusEnum } from "@/utils/enum";

type ProfileRecord = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

const USER_COLUMNS = "id, full_name, email, role, status, created_at";

const toUserRole = (role: string): UserRole =>
  PROFILE_ROLE_TO_USER_ROLE[role as Role] ?? UserRoleEnum.VIEWER;

const toUserStatus = (status: string): UserStatus =>
  PROFILE_STATUS_TO_USER_STATUS[status as ProfileStatusEnum] ??
  UserStatusEnum.INACTIVE;

const mapUser = (profile: ProfileRecord): UserRow => ({
  id: profile.id,
  fullName: profile.full_name,
  email: profile.email,
  role: toUserRole(profile.role),
  status: toUserStatus(profile.status),
  createdAt: profile.created_at.slice(0, 10),
});

const getUsers = async (): Promise<UserRow[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(USER_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as ProfileRecord[]).map(mapUser);
};

const updateUser = async (
  id: string,
  user: UserMutationPayload,
): Promise<UserRow[]> => {
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: user.fullName,
      role: USER_ROLE_TO_PROFILE_ROLE[user.role],
      status: USER_STATUS_TO_PROFILE_STATUS[user.status],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  return getUsers();
};

export default {
  getUsers,
  updateUser,
};
