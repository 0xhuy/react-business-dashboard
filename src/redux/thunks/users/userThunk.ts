import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "@/features/users/user.api";
import { GET_USERS, UPDATE_USER } from "@/utils/constants";
import type { UpdateUserPayload } from "./user.types";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const getUsersThunk = createAsyncThunk(
  GET_USERS,
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.getUsers();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateUserThunk = createAsyncThunk(
  UPDATE_USER,
  async ({ id, user }: UpdateUserPayload, { rejectWithValue }) => {
    try {
      return await userApi.updateUser(id, user);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
