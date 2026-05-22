// ============================================================
// AUTH THUNKS
// ============================================================

// ===== Libs =====
import { createAsyncThunk } from "@reduxjs/toolkit";

// ===== Configs =====
import { supabase } from "@/services/supabase";

// ===== Others =====
import { GET_AUTH } from "@/utils/constants";

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
