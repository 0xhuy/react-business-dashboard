import { Navigate, Outlet } from "react-router-dom";

// tạm fake role
const role = "admin";

interface Props {
  allow: string[];
}

export const ProtectedRoute = ({ allow }: Props) => {
  if (!allow.includes(role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
