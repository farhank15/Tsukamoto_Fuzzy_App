import { Card } from "@/components/ui/card";
import { StudentPerformanceChart } from "@/components/charts/StudentPerformanceChart";
import { PredicateCard } from "@/components/PredicateCard";
import AcademicForm from "@/pages/student/Forms";
import axios from "axios";
import React from "react";
import { getCookie, decodeJwtPayload } from "@/lib/JwtDecode";

const BASE_URL = import.meta.env.VITE_BASE_URL_API;

type Student = {
  id: number;
  university?: { name: string };
  user?: { id: number; name: string; role: string }; // tambahkan id di sini
};

type Props = {
  studentId: string;
};

export function StudentDashboardView({ studentId }: Props) {
  const [student, setStudent] = React.useState<Student | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Ambil user_id dari JWT jika tidak ada student.user?.id
  const token = getCookie("access_token");
  const jwtPayload = decodeJwtPayload<{ user_id?: number }>(token || "");
  const fallbackUserId = jwtPayload?.user_id
    ? String(jwtPayload.user_id)
    : studentId;

  React.useEffect(() => {
    console.log("Fetching studentId:", studentId); // Log studentId
    setLoading(true);
    setError(null);
    axios
      .get(`${BASE_URL}/academic/student/${studentId}`)
      .then((res) => {
        console.log("Student API response:", res.data); // Log response
        // API mengembalikan array, ambil elemen pertama
        if (Array.isArray(res.data) && res.data.length > 0)
          setStudent(res.data[0]);
        else setError("Student not found");
      })
      .catch((err) => {
        console.error("Student API error:", err); // Log error
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        {error} (ID: {studentId})
      </div>
    );
  if (!student)
    return <div className="p-4">Student not found (ID: {studentId})</div>;

  // Gunakan user_id dari student.user?.id jika ada, fallback ke user_id dari JWT, lalu ke studentId param
  const userId =
    student.user && typeof student.user.id === "number"
      ? String(student.user.id)
      : fallbackUserId;

  return (
    <div className="mt-10 p-4">
      <div className="grid grid-cols-[2fr_1fr] gap-4 mb-4">
        {/* Profile Card */}
        <Card className="flex flex-col p-6 row-span-2">
          <h2 className="text-4xl font-bold">{student.user?.name ?? "-"}</h2>
          <p className="text-base text-gray-500">
            university {student.university?.name ?? "-"}
          </p>
        </Card>
        {/* Empty space for first row */}
        <div></div>
        {/* Predicate Card */}
        <PredicateCard studentId={userId} />
      </div>
      <StudentPerformanceChart studentId={userId} />
      <div className="px-4">
        <AcademicForm studentId={userId} />
      </div>
    </div>
  );
}
