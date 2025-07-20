import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRoleFromAccessTokenCookie } from "@/lib/JwtDecode";
import DashboardStudent from "@/pages/student/Dashboard";

export const Route = createFileRoute("/student/dashboard")({
  loader: async () => {
    const role = getRoleFromAccessTokenCookie();
    if (!role) {
      throw redirect({ to: "/gate/login" });
    }
    if (role !== "student") {
      throw redirect({ to: "/admin/dashboard" });
    }
    return null;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student/dashboard">dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DashboardStudent />
    </>
  );
}
