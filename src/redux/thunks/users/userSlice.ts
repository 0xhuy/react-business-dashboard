import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "./user.types";
import {
  getUsersThunk,
  updateUserThunk,
} from "./userThunk";

const initialState: UserState = {
  users: [],
  loading: false,
  isProcessing: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    const startProcessing = (state: UserState) => {
      state.isProcessing = true;
      state.error = null;
    };
    const failProcessing = (
      state: UserState,
      action: { payload?: unknown; error: { message?: string } },
    ) => {
      state.isProcessing = false;
      state.error = String(action.payload ?? action.error.message ?? "");
    };

    builder
      .addCase(updateUserThunk.pending, startProcessing)
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.users = action.payload;
      })
      .addCase(updateUserThunk.rejected, failProcessing);
  },
});

export default userSlice.reducer;
