// ============================================================
// SETTINGS THUNKS
// ============================================================

// ===== Libs =====
import { createAsyncThunk } from "@reduxjs/toolkit";

// ===== Others =====
import settingsApi from "@/features/settings/settings.api";
import type {
  ChangePasswordPayload,
  UpdateSettingsPayload,
} from "@/features/settings/settings.types";
import {
  CHANGE_SETTINGS_PASSWORD,
  GET_SETTINGS,
  UPDATE_SETTINGS,
} from "@/utils/constants";

// ===== Helpers =====
const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// ===== Thunks =====
export const getSettingsThunk = createAsyncThunk(
  GET_SETTINGS,
  async (userId: string, { rejectWithValue }) => {
    try {
      return await settingsApi.getSettings(userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateSettingsThunk = createAsyncThunk(
  UPDATE_SETTINGS,
  async (payload: UpdateSettingsPayload, { rejectWithValue }) => {
    try {
      return await settingsApi.updateSettings(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const changeSettingsPasswordThunk = createAsyncThunk(
  CHANGE_SETTINGS_PASSWORD,
  async (payload: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      await settingsApi.changePassword(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
