import { createAsyncThunk } from "@reduxjs/toolkit";

import productApi from "@/features/products/product.api";
import type { ProductMutationPayload } from "@/features/products/product.types";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCTS,
  SAVE_PRODUCTS,
  UPDATE_PRODUCT,
} from "@/utils/constants";
import type { SaveProductsPayload, UpdateProductPayload } from "./product.type";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const getProductsThunk = createAsyncThunk(
  GET_PRODUCTS,
  async (_, { rejectWithValue }) => {
    try {
      return await productApi.getProducts();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createProductThunk = createAsyncThunk(
  CREATE_PRODUCT,
  async (product: ProductMutationPayload, { rejectWithValue }) => {
    try {
      return await productApi.createProduct(product);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateProductThunk = createAsyncThunk(
  UPDATE_PRODUCT,
  async ({ id, product }: UpdateProductPayload, { rejectWithValue }) => {
    try {
      return await productApi.updateProduct(id, product);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteProductThunk = createAsyncThunk(
  DELETE_PRODUCT,
  async (id: string, { rejectWithValue }) => {
    try {
      await productApi.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const saveProductsThunk = createAsyncThunk(
  SAVE_PRODUCTS,
  async (
    { products, deletedIds }: SaveProductsPayload,
    { rejectWithValue },
  ) => {
    try {
      return await productApi.saveProducts(products, deletedIds);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
