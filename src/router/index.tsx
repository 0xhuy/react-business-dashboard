// ===== Libs =====
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

const renderRoutes = (routes: IRouteModel[], allow: Role[]) =>
  routes.map((route, index) => {
    const Page = route.component;

    return (
      <Route
        key={index}
        path={route.path}
        element={
          <RoleGuard allow={allow}>
            <Page />
          </RoleGuard>
        }
      />
    );
  });

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Redirect root ===== */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ===== Public routes ===== */}
        <Route element={<PublicRoute />}>
          {publicRoutes.map((route, index) => {
            const Page = route.component;

            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Route>

        {/* ===== Private routes ===== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {renderRoutes(privateAdminRoutes, [Role.ADMIN])}
            {renderRoutes(privateStaffRoutes, [Role.STAFF])}
            {renderRoutes(privateViewerRoutes, [Role.VIEWER])}
          </Route>
        </Route>

        {/* ===== Not Found ===== */}
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
};
