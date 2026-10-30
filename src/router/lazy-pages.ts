// ===== Libs =====
import { lazy } from "react";

// ===== Public Pages =====
export const Login = lazy(() => import("@/pages/auth/login/Login"));
export const Register = lazy(() => import("@/pages/auth/register/Register"));
export const ForgotPassword = lazy(
  () => import("@/pages/auth/forgot-password/ForgotPassword"),
);
export const CreateNewPassword = lazy(
  () => import("@/pages/auth/create-new-password/CreateNewPassword"),
);

// ===== Private Pages =====
export const DashboardPage = lazy(
  () => import("@/pages/dashboard/Dashboard"),
);
export const ProductsPage = lazy(
  () => import("@/pages/products/ProductsPage"),
);
export const ProductSheetPage = lazy(
  () => import("@/pages/product-sheet/ProductSheetPage"),
);
export const OrdersPage = lazy(() => import("@/pages/orders/OrdersPage"));
export const OrderDetailPage = lazy(
  () => import("@/pages/orders/OrderDetailPage"),
);
export const UsersPage = lazy(() => import("@/pages/users/UsersPage"));
export const UsersDetailPage = lazy(
  () => import("@/pages/users/UsersDetailPage"),
);
export const SettingsPage = lazy(
  () => import("@/pages/settings/SettingsPage"),
);

// ===== Shared Pages =====
export const NotFoundPage = lazy(
  () => import("@/pages/not-found/NotFoundPage"),
);
