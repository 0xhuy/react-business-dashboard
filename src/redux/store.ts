// ============================================================
// REDUX STORE
// ============================================================

// ===== Libs =====
import {
  configureStore,
  combineReducers,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";

// ===== Reducers =====
import authReducer from "@/redux/thunks/auth/authSlice";
import productReducer from "@/redux/thunks/products/productSlice";
import orderReducer from "@/redux/thunks/orders/orderSlice";
import userReducer from "@/redux/thunks/users/userSlice";
import settingsReducer from "@/redux/thunks/settings/settingsSlice";

// ============================================================
// ROOT REDUCER
// ============================================================
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  orders: orderReducer,
  users: userReducer,
  settings: settingsReducer,
});

// ============================================================
// STORE
// ============================================================
export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: import.meta.env.MODE !== "production",
  });
}

const store = makeStore();

// ============================================================
// TYPES
// ============================================================
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
