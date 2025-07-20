import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRoleFromAccessTokenCookie } from "@/lib/JwtDecode";
import DashboardAdmin from "@/pages/admin/Dashboard";

export const Route = createFileRoute("/admin/dashboard")({
  loader: async () => {
    const role = getRoleFromAccessTokenCookie();
    if (!role) {
      throw redirect({ to: "/gate/login" });
    }
    if (role !== "admin") {
      throw redirect({ to: "/student/dashboard" });
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
            <BreadcrumbLink href="/admin/dashboard">dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DashboardAdmin />
    </>
  );
}
