import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/components/NotFound";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  loader: async ({ location }) => {
    if (location.pathname === "/admin") {
      throw redirect({ to: "/admin/dashboard" });
    }
    return null;
  },
  component: RouteComponent,
  notFoundComponent: NotFound,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
