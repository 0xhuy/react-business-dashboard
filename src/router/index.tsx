// ===== Libs =====
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ===== Layouts =====
import { DashboardLayout } from "@/layouts/dashboard";

// ===== Routes =====
import { publicRoutes } from "./public.routes";
import {
  privateAdminRoutes,
  privateStaffRoutes,
  privateViewerRoutes,
} from "./private.routes";
import { ProtectedRoute } from "./protected";
import { Role } from "@/utils/enum/role.enum";

// ===== Types =====
import type { IRouteModel } from "./route.model";

const renderRoutes = (routes: IRouteModel[]) =>
  routes.map((route, index) => {
    const Page = route.component;

    return <Route key={index} path={route.path} element={<Page />} />;
  });

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Redirect root ===== */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ===== Public routes ===== */}
        {renderRoutes(publicRoutes)}

        {/* ===== Admin routes ===== */}
        <Route element={<ProtectedRoute allow={[Role.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            {renderRoutes(privateAdminRoutes)}
          </Route>
        </Route>

        {/* ===== Staff routes ===== */}
        <Route element={<ProtectedRoute allow={[Role.STAFF]} />}>
          <Route element={<DashboardLayout />}>
            {renderRoutes(privateStaffRoutes)}
          </Route>
        </Route>

        {/* ===== Viewer routes ===== */}
        <Route element={<ProtectedRoute allow={[Role.VIEWER]} />}>
          <Route element={<DashboardLayout />}>
            {renderRoutes(privateViewerRoutes)}
          </Route>
        </Route>

        {/* ===== Not Found ===== */}
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
};
