// ============================================================
// SETTINGS SLICE
// ============================================================

// ===== Libs =====
import { createSlice } from "@reduxjs/toolkit";

// ===== Others =====
import type { SettingsState } from "./settings.types";
import {
  changeSettingsPasswordThunk,
  getSettingsThunk,
  updateSettingsThunk,
} from "./settingsThunk";

// ===== State =====
const initialState: SettingsState = {
  data: null,
  loading: true,
  isSaving: false,
  isChangingPassword: false,
  error: null,
};

// ===== Slice =====
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettings: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getSettingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getSettingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    builder
      .addCase(updateSettingsThunk.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateSettingsThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data = action.payload;
      })
      .addCase(updateSettingsThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    builder
      .addCase(changeSettingsPasswordThunk.pending, (state) => {
        state.isChangingPassword = true;
      })
      .addCase(changeSettingsPasswordThunk.fulfilled, (state) => {
        state.isChangingPassword = false;
      })
      .addCase(changeSettingsPasswordThunk.rejected, (state) => {
        state.isChangingPassword = false;
      });
  },
});

export const settingsActions = settingsSlice.actions;

export default settingsSlice.reducer;
