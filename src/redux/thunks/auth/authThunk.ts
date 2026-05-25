// ============================================================
// AUTH THUNKS
// ============================================================

// ===== Libs =====
import { createAsyncThunk } from "@reduxjs/toolkit";

// ===== Configs =====
import { supabase } from "@/services/supabase";

// ===== Others =====
import { GET_AUTH, LOGOUT_AUTH } from "@/utils/constants";
import authApi from "@/features/auth/auth.api";

// ============================================================
// GET AUTH
// ============================================================
export const getAuthThunk = createAsyncThunk(
  GET_AUTH,
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      return session;
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
