import { Login, Register, ForgotPassword, CreateNewPassword } from "@/pages";

export const publicRoutes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
  },
  {
    path: "/create-new-password",
    component: CreateNewPassword,
  },
];
