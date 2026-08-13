// ===== Libs =====
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";

// ===== Layouts =====
import { MainLayout } from "@/layouts";

// ===== Others =====
import { publicRoutes } from "./public.routes";
import {
  privateAdminRoutes,
  privateStaffRoutes,
  privateViewerRoutes,
} from "./private.routes";
import { ProtectedRoute } from "./protected";
import { PublicRoute } from "./public";
import { Role } from "@/utils/enum/role.enum";
import { RoleGuard } from "./role-guard";
import type { IRouteModel } from "@/utils/interfaces";
import { NotFoundPage } from "@/pages";

const createPrivateRoutes = (
  routes: IRouteModel[],
  allow: Role[],
): RouteObject[] =>
  routes.map((route) => {
    const Page = route.component;

    return {
      path: route.path,
      element: (
        <RoleGuard allow={allow}>
          <Page />
        </RoleGuard>
      ),
    };
  });

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <PublicRoute />,
    children: publicRoutes.map((route) => {
      const Page = route.component;

      return {
        path: route.path,
        element: <Page />,
      };
    }),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          ...createPrivateRoutes(privateAdminRoutes, [Role.ADMIN]),
          ...createPrivateRoutes(privateStaffRoutes, [Role.STAFF]),
          ...createPrivateRoutes(privateViewerRoutes, [Role.VIEWER]),
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
