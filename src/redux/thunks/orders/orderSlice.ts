import { createSlice } from "@reduxjs/toolkit";

import type { OrderState } from "./order.types";
import {
  createPurchaseOrderThunk,
  deletePurchaseOrderThunk,
  getPurchaseOrdersThunk,
  updatePurchaseOrderThunk,
} from "./orderThunk";

const initialState: OrderState = {
  orders: [],
  loading: false,
  isProcessing: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPurchaseOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getPurchaseOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    builder
      .addCase(createPurchaseOrderThunk.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(createPurchaseOrderThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.orders = action.payload;
      })
      .addCase(createPurchaseOrderThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    builder
      .addCase(updatePurchaseOrderThunk.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(updatePurchaseOrderThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.orders = action.payload;
      })
      .addCase(updatePurchaseOrderThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    builder
      .addCase(deletePurchaseOrderThunk.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(deletePurchaseOrderThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.orders = state.orders.filter((order) => order.id !== action.payload);
      })
      .addCase(deletePurchaseOrderThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });
  },
});

export default orderSlice.reducer;
