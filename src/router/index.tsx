// ===== Libs =====
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ===== Layouts =====
import { DashboardLayout } from "@/layouts/dashboard";

// ===== Routes =====
import { publicRoutes } from "./public.routes";
import { privateRoutes } from "./private.routes";

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

        {/* ===== Dashboard layout ===== */}
        <Route element={<DashboardLayout />}>
          {renderRoutes(privateRoutes)}
        </Route>

        {/* ===== Not Found ===== */}
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
};
