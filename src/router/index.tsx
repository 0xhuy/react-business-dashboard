// ===== Libs =====
import { Suspense, type ElementType } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";

// ===== Layouts =====
import { MainLayout } from "@/layouts";

// ===== Components =====
import { ErrorFallback } from "@/components/providers/ErrorFallback";
import { BaseLoading } from "@/components";

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
import type { RouteConfig } from "./router.types";
import { NotFoundPage } from "@/pages";

const renderLazyPage = (Page: ElementType) => (
  <Suspense fallback={<BaseLoading variant="page" size="lg" />}>
    <Page />
  </Suspense>
);

const createPrivateRoutes = (
  routes: RouteConfig[],
  allow: Role[],
): RouteObject[] =>
  routes.map((route) => {
    const Page = route.component;

    return {
      path: route.path,
      element: <RoleGuard allow={allow}>{renderLazyPage(Page)}</RoleGuard>,
    };
  });

const router = createBrowserRouter([
  {
    errorElement: <ErrorFallback />,
    children: [
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
            element: renderLazyPage(Page),
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
        element: renderLazyPage(NotFoundPage),
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
