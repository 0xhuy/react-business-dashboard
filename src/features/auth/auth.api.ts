// ============================================================
// AUTH API
// ============================================================

// ===== Others =====
import { supabase } from "@/services/supabase";
import { DEFAULT_REGISTER_ROLE } from "@/utils/constants";
import type { LoginPayload, RegisterPayload } from "./auth.types";
import { authRouteAbsolute } from "@/utils/constants";

// ===== Api =====
const authApi = {
  login(payload: LoginPayload) {
    return supabase.auth.signInWithPassword(payload);
  },

  register(payload: RegisterPayload) {
    const { fullName, email, password } = payload;

    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
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
