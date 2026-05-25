// ============================================================
// AUTH SLICE
// ============================================================

// ===== Libs =====
import { createSlice } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";

// ===== Others =====
import { getAuthThunk, logoutAuthThunk } from "./authThunk";
// ============================================================
// AUTH STATE
// ============================================================
export interface AuthState {
  session: Session | null;
  user: User | null;
  role: string | null;
  loading: boolean;
}

// ============================================================
// INITIAL STATE
// ============================================================
const initialState: AuthState = {
  session: null,
  user: null,
  role: null,
  loading: false,
};

// ============================================================
// AUTH SLICE
// ============================================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState(state) {
      state.session = null;
      state.user = null;
      state.role = null;
      state.loading = false;
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

        state.session = action.payload;
        console.log(action.payload?.user);
        state.user = action.payload?.user || null;
        state.role = action.payload?.user?.user_metadata?.role || null;
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
