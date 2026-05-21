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
};

export const staffRoute = {
  base: "/staff",
  dashboard: "",
};

export const viewerRoute = {
  base: "/viewer",
  dashboard: "",
};

// ============================================================
// ROLE ABSOLUTE ROUTES
// ============================================================
export const adminRouteAbsolute = {
  dashboard: `${adminRoute.base}${adminRoute.dashboard}`,
};

export const staffRouteAbsolute = {
  dashboard: `${staffRoute.base}${staffRoute.dashboard}`,
};

export const viewerRouteAbsolute = {
  dashboard: `${viewerRoute.base}${viewerRoute.dashboard}`,
};
