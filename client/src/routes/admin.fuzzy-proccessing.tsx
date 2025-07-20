import FuzzyProccessing from "@/pages/admin/FuzzyProccessing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/fuzzy-proccessing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <FuzzyProccessing />
    </div>
  );
}
