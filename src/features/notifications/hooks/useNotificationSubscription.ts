// ===== Libs =====
import { useEffect } from "react";

// ===== Others =====
import { useAppDispatch } from "@/redux/hooks";
import { getNotificationsThunk } from "@/redux/thunks/notifications/notificationThunk";
import { notificationActions } from "@/redux/thunks/notifications/notificationSlice";
import { supabase } from "@/services/supabase";
import { Role } from "@/utils/enum";

// ===== Hook =====
const useNotificationSubscription = (
  userId: string | undefined,
  role: Role | null,
) => {
  const dispatch = useAppDispatch();
  const canViewNotifications =
    role === Role.ADMIN || role === Role.STAFF;

  useEffect(() => {
    if (!userId || !canViewNotifications) {
      dispatch(notificationActions.resetNotifications());
      return;
    }

    void dispatch(getNotificationsThunk(userId));

    const notificationChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void dispatch(getNotificationsThunk(userId));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(notificationChannel);
    };
  }, [canViewNotifications, dispatch, userId]);

  return canViewNotifications;
};

export default useNotificationSubscription;
