// ============================================================
// AUTH PROVIDER
// ============================================================

// ===== Libs =====
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// ===== Hooks =====
import { useAppDispatch, useAuth } from "@/redux/hooks";

// ===== Thunks =====
import { getAuthThunk } from "@/redux/thunks/auth/authThunk";
import { authActions } from "@/redux/thunks/auth/authSlice";
import { settingsActions } from "@/redux/thunks/settings/settingsSlice";
import { getSettingsThunk } from "@/redux/thunks/settings/settingsThunk";
import { supabase } from "@/services/supabase";

// ===== Types =====
type Props = {
  children: React.ReactNode;
};

// ===== Component =====
export const AuthProvider = ({ children }: Props) => {
  // ===== Hooks =====
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { i18n } = useTranslation();

  // ===== Effects =====
  useEffect(() => {
    void dispatch(getAuthThunk());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(authActions.syncSession(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!user?.id) {
      dispatch(settingsActions.resetSettings());
      return;
    }

    let isActive = true;

    void dispatch(getSettingsThunk(user.id))
      .unwrap()
      .then(({ language }) => {
        if (isActive) void i18n.changeLanguage(language);
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, [dispatch, i18n, user?.id]);

  return <>{children}</>;
};
