// ===== Pages =====
import { AdminDashboard, StaffDashboard, ViewerDashboard } from "@/pages";

// ===== Enums =====
import { Role } from "@/utils/enum/role.enum";

// ===== Types =====
import type { IRouteModel } from "./route.model";

export const privateRoutes: IRouteModel[] = [
  // ===== Admin =====
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    role: Role.ADMIN,
    name: "Dashboard",
  },

  // ===== Staff =====
  {
    path: "/staff/dashboard",
    component: StaffDashboard,
    role: Role.STAFF,
    name: "Dashboard",
  },

  // ===== Viewer =====
  {
    path: "/viewer/dashboard",
    component: ViewerDashboard,
    role: Role.VIEWER,
    name: "Dashboard",
  },
];
