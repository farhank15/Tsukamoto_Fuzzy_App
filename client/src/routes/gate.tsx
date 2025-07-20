import NotFound from "@/components/NotFound";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/gate")({
  component: RouteComponent,
  notFoundComponent: NotFound,
});

function RouteComponent() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
