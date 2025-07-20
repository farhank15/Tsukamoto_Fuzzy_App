import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getRoleFromAccessTokenCookie } from "@/lib/JwtDecode";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/student/form")({
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/student/form">form</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
