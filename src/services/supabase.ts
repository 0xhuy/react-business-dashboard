// ============================================================
// SUPABASE CLIENT
// ============================================================

// ===== Libs =====
import { createClient } from "@supabase/supabase-js";

// ===== Constants =====
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

// ===== Client =====
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
