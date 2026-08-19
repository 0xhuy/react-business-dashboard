// ============================================================
// AUTH SLICE
// ============================================================

// ===== Libs =====
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";

// ===== Others =====
import { getAuthThunk, logoutAuthThunk } from "./authThunk";
import type { Role } from "@/utils/enum";
// ============================================================
// AUTH STATE
// ============================================================
export interface AuthState {
  session: Session | null;
  user: User | null;
  role: Role | null;
  loading: boolean;
}

// ============================================================
// INITIAL STATE
// ============================================================
const initialState: AuthState = {
  session: null,
  user: null,
  role: null,
  loading: true,
};

// ============================================================
// AUTH SLICE
// ============================================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    syncSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;

      if (!action.payload) state.role = null;
    },
  },
  extraReducers(builder) {
    // ===== Get Auth =====
    builder
      .addCase(getAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAuthThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.session = action.payload.session;
        state.user = action.payload.session?.user || null;
        state.role = action.payload.role;
      })
      .addCase(getAuthThunk.rejected, (state) => {
        state.loading = false;
      });

    // ===== Logout =====
    builder
      .addCase(logoutAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAuthThunk.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.role = null;
        state.loading = false;
      })
      .addCase(logoutAuthThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const authActions = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
