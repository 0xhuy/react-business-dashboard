// ===== Libs =====
import { createSlice } from "@reduxjs/toolkit";

// ===== Others =====
import type { NotificationState } from "./notification.types";
import {
  deleteNotificationThunk,
  getNotificationsThunk,
  markAllNotificationsAsReadThunk,
  markNotificationAsReadThunk,
} from "./notificationThunk";

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  processingNotificationId: null,
  isMarkingAllAsRead: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getNotificationsThunk.pending, (state) => {
        state.loading = state.notifications.length === 0;
        state.error = null;
      })
      .addCase(getNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    builder
      .addCase(markNotificationAsReadThunk.pending, (state, action) => {
        state.processingNotificationId = action.meta.arg.notificationId;
        state.error = null;
      })
      .addCase(markNotificationAsReadThunk.fulfilled, (state, action) => {
        state.processingNotificationId = null;
        const notification = state.notifications.find(
          (item) => item.id === action.payload,
        );
        if (notification) notification.isRead = true;
      })
      .addCase(markNotificationAsReadThunk.rejected, (state, action) => {
        state.processingNotificationId = null;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    builder
      .addCase(markAllNotificationsAsReadThunk.pending, (state) => {
        state.isMarkingAllAsRead = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsReadThunk.fulfilled, (state) => {
        state.isMarkingAllAsRead = false;
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });
      })
      .addCase(markAllNotificationsAsReadThunk.rejected, (state, action) => {
        state.isMarkingAllAsRead = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    builder
      .addCase(deleteNotificationThunk.pending, (state, action) => {
        state.processingNotificationId = action.meta.arg.notificationId;
        state.error = null;
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        state.processingNotificationId = null;
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload,
        );
      })
      .addCase(deleteNotificationThunk.rejected, (state, action) => {
        state.processingNotificationId = null;
        state.error = String(action.payload ?? action.error.message ?? "");
      });
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;
