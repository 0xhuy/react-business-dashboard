// ============================================================
// AUTH PROVIDER
// ============================================================

// ===== Libs =====
import { useEffect } from "react";

// ===== Hooks =====
import { useAppDispatch } from "@/redux/hooks";

// ===== Thunks =====
import { getAuthThunk } from "@/redux/thunks/auth/authThunk";

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
  }, [dispatch]);

  return <>{children}</>;
};
