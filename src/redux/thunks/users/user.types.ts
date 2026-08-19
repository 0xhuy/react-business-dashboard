import type {
  UserMutationPayload,
  UserRow,
} from "@/features/users/user.types";

export type UserState = {
  users: UserRow[];
  loading: boolean;
  isProcessing: boolean;
  error: string | null;
};

export type UpdateUserPayload = {
  id: string;
  user: UserMutationPayload;
};
