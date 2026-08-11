// ============================================================
// AUTH TYPES
// ============================================================
import type { User } from "@supabase/supabase-js";
import type { Role } from "@/utils/enum";

export interface AuthState {
  user: User | null;
  role: Role | null;
  loading: boolean;
}
