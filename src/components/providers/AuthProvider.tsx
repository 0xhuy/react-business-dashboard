// ============================================================
// AUTH PROVIDER
// ============================================================

// ===== Libs =====
import { useEffect } from "react";

// ===== Hooks =====
import { useAppDispatch } from "@/redux/hooks";

// ===== Thunks =====
import { getAuthThunk } from "@/redux/thunks/auth/authThunk";
import { authActions } from "@/redux/thunks/auth/authSlice";
import { supabase } from "@/services/supabase";

// ===== Types =====
type Props = {
  children: React.ReactNode;
};

// ===== Component =====
export const AuthProvider = ({ children }: Props) => {
  // ===== Hooks =====
  const dispatch = useAppDispatch();

  // ===== Effects =====
  useEffect(() => {
    dispatch(getAuthThunk());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(authActions.syncAuthSession(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};
