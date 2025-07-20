import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginForm from "@/pages/auth/Login";
import { getRoleFromAccessTokenCookie } from "@/lib/JwtDecode";
import NotFound from "@/components/notFound";

export const Route = createFileRoute("/gate/login")({
  loader: async () => {
    const role = getRoleFromAccessTokenCookie();
    if (role === "admin") {
      throw redirect({ to: "/admin/dashboard" });
    }
    if (role === "student") {
      throw redirect({ to: "/student/dashboard" });
    }
    return null;
  },
  component: LoginForm,
  notFoundComponent: NotFound,
});
