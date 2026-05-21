// ============================================================
// AUTH API
// ============================================================

// ===== Others =====
import { supabase } from "@/lib/supabase";
import { DEFAULT_REGISTER_ROLE } from "./auth.constant";
import type { LoginPayload, RegisterPayload } from "./auth.type";
import { authRouteAbsolute } from "@/utils/constants";

// ===== Api =====
const authApi = {
  login(payload: LoginPayload) {
    return supabase.auth.signInWithPassword(payload);
  },

  register(payload: RegisterPayload) {
    const { email, password } = payload;

    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: DEFAULT_REGISTER_ROLE,
        },
      },
    });
  },

  forgotPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${authRouteAbsolute.createNewPassword}`,
    });
  },

  createNewPassword(password: string) {
    return supabase.auth.updateUser({
      password,
    });
  },

  logout() {
    return supabase.auth.signOut();
  },

  getSession() {
    return supabase.auth.getSession();
  },
};

export default authApi;
