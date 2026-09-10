// ===== Libs =====
import { createAsyncThunk } from "@reduxjs/toolkit";

// ===== Others =====
import notificationApi from "@/features/notifications/notification.api";
import type { NotificationMutationPayload } from "@/features/notifications/notification.types";
import {
  DELETE_NOTIFICATION,
  GET_NOTIFICATIONS,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_AS_READ,
} from "@/utils/constants";
import { getErrorTranslationKey } from "@/utils/errors";

export const getNotificationsThunk = createAsyncThunk(
  GET_NOTIFICATIONS,
  async (userId: string, { rejectWithValue }) => {
    try {
      return await notificationApi.getNotifications(userId);
    } catch (error) {
      return rejectWithValue(getErrorTranslationKey(error));
    }
  },
);

export const markNotificationAsReadThunk = createAsyncThunk(
  MARK_NOTIFICATION_AS_READ,
  async (
    { notificationId, userId }: NotificationMutationPayload,
    { rejectWithValue },
  ) => {
    try {
      return await notificationApi.markNotificationAsRead(
        notificationId,
        userId,
      );
    } catch (error) {
      return rejectWithValue(getErrorTranslationKey(error));
    }
  },
);

export const markAllNotificationsAsReadThunk = createAsyncThunk(
  MARK_ALL_NOTIFICATIONS_AS_READ,
  async (userId: string, { rejectWithValue }) => {
    try {
      await notificationApi.markAllNotificationsAsRead(userId);
    } catch (error) {
      return rejectWithValue(getErrorTranslationKey(error));
    }
  },
);

export const deleteNotificationThunk = createAsyncThunk(
  DELETE_NOTIFICATION,
  async (
    { notificationId, userId }: NotificationMutationPayload,
    { rejectWithValue },
  ) => {
    try {
      return await notificationApi.deleteNotification(notificationId, userId);
    } catch (error) {
      return rejectWithValue(getErrorTranslationKey(error));
    }
  },
);
