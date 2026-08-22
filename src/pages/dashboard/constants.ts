import type { DashboardConfig } from "./types";
import { Role } from "@/utils/enum";
import {
  adminRouteAbsolute,
  staffRouteAbsolute,
  viewerRouteAbsolute,
} from "@/utils/constants/route.constants";

export const DASHBOARD_PRODUCT_CHART_LIMIT = 4;

export const DASHBOARD_RECENT_ORDER_LIMIT = 3;

export const DASHBOARD_LOW_STOCK_LIMIT = 3;

export const DASHBOARD_CONFIG_BY_ROLE: Record<Role, DashboardConfig> = {
  [Role.ADMIN]: {
    canViewPurchaseOrders: true,
    canViewUsers: true,
    productsPath: adminRouteAbsolute.productList,
    purchaseOrdersPath: adminRouteAbsolute.orders,
  },
  [Role.STAFF]: {
    canViewPurchaseOrders: true,
    canViewUsers: false,
    productsPath: staffRouteAbsolute.productList,
    purchaseOrdersPath: staffRouteAbsolute.orders,
  },
  [Role.VIEWER]: {
    canViewPurchaseOrders: false,
    canViewUsers: false,
    productsPath: viewerRouteAbsolute.productList,
  },
};
