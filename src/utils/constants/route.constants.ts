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
  users: "/users",
  settings: "/settings",
};

export const staffRoute = {
  base: "/staff",
  dashboard: "",
  products: "/products",
  productList: "/products/list",
  productSheet: "/products/sheet",
  orders: "/orders",
};

export const viewerRoute = {
  base: "/viewer",
  dashboard: "",
  products: "/products",
  productList: "/products/list",
  productSheet: "/products/sheet",
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
  users: `${adminRoute.base}${adminRoute.users}`,
  settings: `${adminRoute.base}${adminRoute.settings}`,
};

export const staffRouteAbsolute = {
  dashboard: `${staffRoute.base}${staffRoute.dashboard}`,
  products: `${staffRoute.base}${staffRoute.products}`,
  productList: `${staffRoute.base}${staffRoute.productList}`,
  productSheet: `${staffRoute.base}${staffRoute.productSheet}`,
  orders: `${staffRoute.base}${staffRoute.orders}`,
};

export const viewerRouteAbsolute = {
  dashboard: `${viewerRoute.base}${viewerRoute.dashboard}`,
  products: `${viewerRoute.base}${viewerRoute.products}`,
  productList: `${viewerRoute.base}${viewerRoute.productList}`,
  productSheet: `${viewerRoute.base}${viewerRoute.productSheet}`,
};
