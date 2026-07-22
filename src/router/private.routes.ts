// ===== Pages =====
import {
  AdminDashboard,
  StaffDashboard,
  ViewerDashboard,
  ProductsPage,
  ProductSheetPage,
  OrdersPage,
  OrderDetailPage,
  UsersPage,
  SettingsPage,
} from "@/pages";

// ===== Others =====
import {
  adminRouteAbsolute,
  staffRouteAbsolute,
  viewerRouteAbsolute,
} from "@/utils/constants";
import { icons } from "@/assets";

// ===== Types =====
import type { IRouteModel } from "@/utils/interfaces";

// ============================================================
// ADMIN ROUTES
// ============================================================
const privateAdminRouteMenus: IRouteModel[] = [
  {
    path: adminRouteAbsolute.dashboard,
    component: AdminDashboard,
    name: "sidebar.dashboard",
    icon: icons.iconOverviewInactive,
    iconActive: icons.iconOverviewActive,
  },
  {
    path: adminRouteAbsolute.products,
    component: ProductsPage,
    name: "sidebar.products",
    icon: icons.iconProductInactive,
    iconActive: icons.iconProductActive,
    children: [
      {
        path: adminRouteAbsolute.productList,
        component: ProductsPage,
        name: "sidebar.product_list",
      },
      {
        path: adminRouteAbsolute.productSheet,
        component: ProductSheetPage,
        name: "sidebar.product_sheet",
      },
    ],
  },
  {
    path: adminRouteAbsolute.orders,
    component: OrdersPage,
    name: "sidebar.orders",
    icon: icons.iconOrderInactive,
    iconActive: icons.iconOrderActive,
    children: [
      {
        path: adminRouteAbsolute.orderDetail,
        component: OrderDetailPage,
        hidden: true,
      },
    ],
  },
  {
    path: adminRouteAbsolute.users,
    component: UsersPage,
    name: "sidebar.users",
    icon: icons.iconUsersInactive,
    iconActive: icons.iconUsersActive,
  },
  {
    path: adminRouteAbsolute.settings,
    component: SettingsPage,
    name: "sidebar.settings",
    icon: icons.iconSettingInactive,
    iconActive: icons.iconSettingActive,
  },
];

export const privateAdminRouteGroups = [
  {
    name: "admin_main",
    menu: privateAdminRouteMenus,
  },
];

export const privateAdminRoutes: IRouteModel[] = [
  {
    path: adminRouteAbsolute.dashboard,
    component: AdminDashboard,
  },
  {
    path: adminRouteAbsolute.products,
    component: ProductsPage,
  },
  {
    path: adminRouteAbsolute.productList,
    component: ProductsPage,
  },
  {
    path: adminRouteAbsolute.productSheet,
    component: ProductSheetPage,
  },
  {
    path: adminRouteAbsolute.orders,
    component: OrdersPage,
  },
  {
    path: adminRouteAbsolute.orderDetail,
    component: OrderDetailPage,
  },
  {
    path: adminRouteAbsolute.users,
    component: UsersPage,
  },
  {
    path: adminRouteAbsolute.settings,
    component: SettingsPage,
  },
];

// ============================================================
// STAFF ROUTES
// ============================================================
const privateStaffRouteMenus: IRouteModel[] = [
  {
    path: staffRouteAbsolute.dashboard,
    component: StaffDashboard,
    name: "sidebar.dashboard",
    icon: icons.iconOverviewInactive,
    iconActive: icons.iconOverviewActive,
  },
  {
    path: staffRouteAbsolute.products,
    component: ProductsPage,
    name: "sidebar.products",
    icon: icons.iconProductInactive,
    iconActive: icons.iconProductActive,
    children: [
      {
        path: staffRouteAbsolute.productList,
        component: ProductsPage,
        name: "sidebar.product_list",
      },
      {
        path: staffRouteAbsolute.productSheet,
        component: ProductSheetPage,
        name: "sidebar.product_sheet",
      },
    ],
  },
  {
    path: staffRouteAbsolute.orders,
    component: OrdersPage,
    name: "sidebar.orders",
    icon: icons.iconOrderInactive,
    iconActive: icons.iconOrderActive,
    children: [
      {
        path: adminRouteAbsolute.orderDetail,
        component: OrderDetailPage,
        hidden: true,
      },
    ],
  },
];

export const privateStaffRouteGroups = [
  {
    name: "staff_main",
    menu: privateStaffRouteMenus,
  },
];

export const privateStaffRoutes: IRouteModel[] = [
  {
    path: staffRouteAbsolute.dashboard,
    component: StaffDashboard,
  },
  {
    path: staffRouteAbsolute.products,
    component: ProductsPage,
  },
  {
    path: staffRouteAbsolute.productList,
    component: ProductsPage,
  },
  {
    path: staffRouteAbsolute.productSheet,
    component: ProductSheetPage,
  },
  {
    path: staffRouteAbsolute.orders,
    component: OrdersPage,
  },
  {
    path: staffRouteAbsolute.orderDetail,
    component: OrderDetailPage,
  },
];

// ============================================================
// VIEWER ROUTES
// ============================================================
const privateViewerRouteMenus: IRouteModel[] = [
  {
    path: viewerRouteAbsolute.dashboard,
    component: ViewerDashboard,
    name: "sidebar.dashboard",
    icon: icons.iconOverviewInactive,
    iconActive: icons.iconOverviewActive,
  },
  {
    path: viewerRouteAbsolute.products,
    component: ProductsPage,
    name: "sidebar.products",
    icon: icons.iconProductInactive,
    iconActive: icons.iconProductActive,
    children: [
      {
        path: viewerRouteAbsolute.productList,
        component: ProductsPage,
        name: "sidebar.product_list",
      },
      {
        path: viewerRouteAbsolute.productSheet,
        component: ProductSheetPage,
        name: "sidebar.product_sheet",
      },
    ],
  },
];

export const privateViewerRouteGroups = [
  {
    name: "viewer_main",
    menu: privateViewerRouteMenus,
  },
];

export const privateViewerRoutes: IRouteModel[] = [
  {
    path: viewerRouteAbsolute.dashboard,
    component: ViewerDashboard,
  },
  {
    path: viewerRouteAbsolute.products,
    component: ProductsPage,
  },
  {
    path: viewerRouteAbsolute.productList,
    component: ProductsPage,
  },
  {
    path: viewerRouteAbsolute.productSheet,
    component: ProductSheetPage,
  },
];
