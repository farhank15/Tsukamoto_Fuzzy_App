import { StudentDashboardView } from "@/components/StudentDashboardView";
import { useParams } from "@tanstack/react-router";

const DetailStudent = () => {
  const { studentId } = useParams({ from: "/admin/student/$studentId" });
  return (
    <div>
      <StudentDashboardView studentId={studentId} />
    </div>
  );
};

export default DetailStudent;
