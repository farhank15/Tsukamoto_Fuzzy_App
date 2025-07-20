import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getRoleFromAccessTokenCookie } from "@/lib/JwtDecode";
import Statistic from "@/pages/admin/Statistic";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/statistics")({
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/statistics">Statistics</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
        <Statistic />
      </Breadcrumb>
    </>
  );
}
