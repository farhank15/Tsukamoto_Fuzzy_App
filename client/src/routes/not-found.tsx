export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-lg text-muted-foreground">Page Not Found</p>
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/not-found")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/not-found"!</div>;
}
