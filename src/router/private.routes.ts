// ============================================================
// PRIVATE ROUTES
// ============================================================

// ===== Pages =====
import { AdminDashboard, StaffDashboard, ViewerDashboard } from "@/pages";

// ===== Others =====
import {
  adminRouteAbsolute,
  staffRouteAbsolute,
  viewerRouteAbsolute,
} from "@/utils/constants";
import { Role } from "@/utils/enum/role.enum";

// ===== Types =====
import type { IRouteModel } from "./route.model";

// ============================================================
// ADMIN ROUTES
// ============================================================
export const privateAdminRoutes: IRouteModel[] = [
  {
    path: adminRouteAbsolute.dashboard,
    component: AdminDashboard,
    role: Role.ADMIN,
    name: "sidebar.dashboard",
  },
];

// ============================================================
// STAFF ROUTES
// ============================================================
export const privateStaffRoutes: IRouteModel[] = [
  {
    path: staffRouteAbsolute.dashboard,
    component: StaffDashboard,
    role: Role.STAFF,
    name: "sidebar.dashboard",
  },
];

// ============================================================
// VIEWER ROUTES
// ============================================================
export const privateViewerRoutes: IRouteModel[] = [
  {
    path: viewerRouteAbsolute.dashboard,
    component: ViewerDashboard,
    role: Role.VIEWER,
    name: "sidebar.dashboard",
  },
];
