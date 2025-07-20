import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import NotFound from "./not-found";

export const Route = createFileRoute("/student")({
  loader: async ({ location }) => {
    if (location.pathname === "/student") {
      throw redirect({ to: "/student/dashboard" });
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
        <div className="pl-2">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
