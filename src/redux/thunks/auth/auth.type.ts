// ============================================================
// AUTH TYPES
// ============================================================
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  role: string | null;
  loading: boolean;
}
