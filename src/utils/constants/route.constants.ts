import { Role } from "@/utils/enum";

// ============================================================
// AUTH ROUTES
// ============================================================
export const authRouteAbsolute = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  createNewPassword: "/create-new-password",
};

// ============================================================
// ROLE ROUTES
// ============================================================
export const adminRoute = {
  base: "/admin",
  dashboard: "",
  products: "/products",
  productList: "/products/list",
  productSheet: "/products/sheet",
  orders: "/orders",
  orderDetail: "/orders/:id",
  users: "/users",
  userDetail: "/users/:id",
  settings: "/settings",
};

export const staffRoute = {
  base: "/staff",
  dashboard: "",
  products: "/products",
  productList: "/products/list",
  productSheet: "/products/sheet",
  orders: "/orders",
  orderDetail: "/orders/:id",
  settings: "/settings",
};

export const viewerRoute = {
  base: "/viewer",
  dashboard: "",
  products: "/products",
  productList: "/products/list",
  productSheet: "/products/sheet",
  settings: "/settings",
};

// ============================================================
// ROLE ABSOLUTE ROUTES
// ============================================================
export const adminRouteAbsolute = {
  dashboard: `${adminRoute.base}${adminRoute.dashboard}`,
  products: `${adminRoute.base}${adminRoute.products}`,
  productList: `${adminRoute.base}${adminRoute.productList}`,
  productSheet: `${adminRoute.base}${adminRoute.productSheet}`,
  orders: `${adminRoute.base}${adminRoute.orders}`,
  orderDetail: `${adminRoute.base}${adminRoute.orderDetail}`,
  users: `${adminRoute.base}${adminRoute.users}`,
  userDetail: `${adminRoute.base}${adminRoute.userDetail}`,
  settings: `${adminRoute.base}${adminRoute.settings}`,
};

export const staffRouteAbsolute = {
  dashboard: `${staffRoute.base}${staffRoute.dashboard}`,
  products: `${staffRoute.base}${staffRoute.products}`,
  productList: `${staffRoute.base}${staffRoute.productList}`,
  productSheet: `${staffRoute.base}${staffRoute.productSheet}`,
  orders: `${staffRoute.base}${staffRoute.orders}`,
  orderDetail: `${staffRoute.base}${staffRoute.orderDetail}`,
  settings: `${staffRoute.base}${staffRoute.settings}`,
};

export const viewerRouteAbsolute = {
  dashboard: `${viewerRoute.base}${viewerRoute.dashboard}`,
  products: `${viewerRoute.base}${viewerRoute.products}`,
  productList: `${viewerRoute.base}${viewerRoute.productList}`,
  productSheet: `${viewerRoute.base}${viewerRoute.productSheet}`,
  settings: `${viewerRoute.base}${viewerRoute.settings}`,
};

export const SETTINGS_ROUTE_BY_ROLE: Record<Role, string> = {
  [Role.ADMIN]: adminRouteAbsolute.settings,
  [Role.STAFF]: staffRouteAbsolute.settings,
  [Role.VIEWER]: viewerRouteAbsolute.settings,
};
