import { getRoleFromAccessTokenCookie } from "@/lib/JwtDecode";
import { Register } from "@/pages/auth/Register";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/gate/register")({
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
  component: Register,
});