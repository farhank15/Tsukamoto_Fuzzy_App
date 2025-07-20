import { Button } from "@/components/ui/button";
import { getRoleFromAccessTokenCookie } from "@/lib/JwtDecode";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async ({ location }) => {
    const role = getRoleFromAccessTokenCookie();
    if (location.pathname === "/") {
      throw redirect({ to: "/gate/login" });
    }
    if (!role) {
      throw redirect({ to: "/gate/login" });
    }
    if (role === "admin") {
      throw redirect({ to: "/admin/dashboard" });
    }
    if (role === "student") {
      throw redirect({ to: "/student/dashboard" });
    }
    return null;
  },
  component: App,
});

function App() {
  return (
    <div>
      <Button variant="outline">Button</Button>{" "}
    </div>
  );
}
