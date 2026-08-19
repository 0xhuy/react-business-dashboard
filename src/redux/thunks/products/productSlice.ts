import { createSlice } from "@reduxjs/toolkit";

import type { ProductState } from "./product.type";
import {
  createProductThunk,
  deleteProductThunk,
  getProductsThunk,
  saveProductsThunk,
  updateProductThunk,
} from "./productThunk";

const initialState: ProductState = {
  products: [],
  loading: false,
  isProcessing: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(getProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    // ===== Create Product =====
    builder
      .addCase(createProductThunk.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.products.push(action.payload);
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    // ===== Update Product =====
    builder
      .addCase(updateProductThunk.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        const productIndex = state.products.findIndex(
          (product) => product.id === action.payload.id,
        );

        if (productIndex >= 0) state.products[productIndex] = action.payload;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    // ===== Delete Product =====
    builder
      .addCase(deleteProductThunk.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload,
        );
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });

    // ===== Save Products =====
    builder
      .addCase(saveProductsThunk.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(saveProductsThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.products = action.payload;
      })
      .addCase(saveProductsThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = String(action.payload ?? action.error.message ?? "");
      });
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
