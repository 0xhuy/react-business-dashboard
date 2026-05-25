// ============================================================
// REDUX HOOKS
// ============================================================

// ===== Libs =====
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

// ===== Others =====
import type { AppDispatch, RootState } from "./store";

// ===== Hooks =====
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ===== Auth =====
export const useAuth = () => useAppSelector((state) => state.auth);
