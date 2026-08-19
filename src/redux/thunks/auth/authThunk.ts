// ============================================================
// AUTH THUNKS
// ============================================================

// ===== Libs =====
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";

// ===== Configs =====
import { supabase } from "@/services/supabase";

// ===== Others =====
import { GET_AUTH, LOGOUT_AUTH } from "@/utils/constants";
import authApi from "@/features/auth/auth.api";
import { ProfileStatusEnum, Role } from "@/utils/enum";

type AuthProfile = {
  role: Role;
  status: ProfileStatusEnum;
};

const getAuthProfile = async (userId: string): Promise<AuthProfile> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const role = Object.values(Role).includes(data?.role as Role)
    ? (data?.role as Role)
    : Role.VIEWER;

  return {
    role,
    status:
      data?.status === ProfileStatusEnum.ACTIVE
        ? ProfileStatusEnum.ACTIVE
        : ProfileStatusEnum.INACTIVE,
  };
};

// ============================================================
// GET AUTH
// ============================================================
export const getAuthThunk = createAsyncThunk(
  GET_AUTH,
  async (providedSession: Session | undefined, { rejectWithValue }) => {
    try {
      let session = providedSession ?? null;

      if (!session) {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;
        session = data.session;
      }

      if (!session) {
        return { session: null, role: null, isInactive: false };
      }

      const profile = await getAuthProfile(session.user.id);

      if (profile.status === ProfileStatusEnum.INACTIVE) {
        await supabase.auth.signOut();
        return { session: null, role: null, isInactive: true };
      }

      return { session, role: profile.role, isInactive: false };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const logoutAuthThunk = createAsyncThunk(
  LOGOUT_AUTH,
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await authApi.logout();

      if (error) {
        return rejectWithValue(error);
      }

      return true;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
