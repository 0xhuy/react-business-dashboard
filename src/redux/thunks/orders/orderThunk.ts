import { createAsyncThunk } from "@reduxjs/toolkit";

import orderApi from "@/features/orders/order.api";
import type { PurchaseOrderMutationPayload } from "@/features/orders/order.types";
import {
  CREATE_PURCHASE_ORDER,
  DELETE_PURCHASE_ORDER,
  GET_PURCHASE_ORDERS,
  UPDATE_PURCHASE_ORDER,
} from "@/utils/constants";
import type { UpdatePurchaseOrderPayload } from "./order.types";
import { getErrorTranslationKey } from "@/utils/errors";

export const getPurchaseOrdersThunk = createAsyncThunk(
  GET_PURCHASE_ORDERS,
  async (_, { rejectWithValue }) => {
    try {
      return await orderApi.getPurchaseOrders();
    } catch (error) {
      return rejectWithValue(getErrorTranslationKey(error));
    }
  },
);

export const createPurchaseOrderThunk = createAsyncThunk(
  CREATE_PURCHASE_ORDER,
  async (order: PurchaseOrderMutationPayload, { rejectWithValue }) => {
    try {
      return await orderApi.createPurchaseOrder(order);
    } catch (error) {
      return rejectWithValue(getErrorTranslationKey(error));
    }
  },
);

export const updatePurchaseOrderThunk = createAsyncThunk(
  UPDATE_PURCHASE_ORDER,
  async ({ id, order }: UpdatePurchaseOrderPayload, { rejectWithValue }) => {
    try {
      return await orderApi.updatePurchaseOrder(id, order);
    } catch (error) {
      return rejectWithValue(getErrorTranslationKey(error));
    }
  },
);

export const deletePurchaseOrderThunk = createAsyncThunk(
  DELETE_PURCHASE_ORDER,
  async (id: string, { rejectWithValue }) => {
    try {
      return await orderApi.deletePurchaseOrder(id);
    } catch (error) {
      return rejectWithValue(getErrorTranslationKey(error));
    }
  },
);
