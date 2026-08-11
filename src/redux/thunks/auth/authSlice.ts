// ============================================================
// AUTH SLICE
// ============================================================

// ===== Libs =====
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";

// ===== Others =====
import { getAuthThunk, logoutAuthThunk } from "./authThunk";
import { Role } from "@/utils/enum";

const getSessionRole = (session: Session | null): Role | null => {
  const role = session?.user.user_metadata?.role;

  return Object.values(Role).includes(role as Role) ? (role as Role) : null;
};
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
    syncAuthSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
      state.role = getSessionRole(action.payload);
      state.loading = false;
    },
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
        state.user = action.payload?.user || null;
        state.role = getSessionRole(action.payload);
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
