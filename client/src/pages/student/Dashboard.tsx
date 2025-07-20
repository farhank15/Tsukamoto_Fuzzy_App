import { Card } from "@/components/ui/card";
import { StudentPerformanceChart } from "@/components/charts/StudentPerformanceChart";
import { PredicateCard } from "@/components/PredicateCard";
import {
  getNameFromAccessTokenCookie,
  getUniversityFromAccessTokenCookie,
  getCookie,
  decodeJwtPayload,
} from "@/lib/JwtDecode";
import AcademicForm from "./Forms";

const DashboardStudent = () => {
  const username = getNameFromAccessTokenCookie() ?? "User";
  const university = getUniversityFromAccessTokenCookie() ?? "-";

  // Ambil user_id dari JWT untuk dikirim ke PredicateCard dan StudentPerformanceChart
  const token = getCookie("access_token");
  const jwtPayload = decodeJwtPayload<{ user_id?: number }>(token || "");
  const userId = jwtPayload?.user_id ? String(jwtPayload.user_id) : undefined;

  return (
    <>
      <div className="mt-10 p-4">
        <div className="grid grid-cols-[2fr_1fr] gap-4 mb-4">
          {/* Profile Card */}
          <Card className="flex flex-col p-6 row-span-2">
            <h2 className="text-4xl font-bold">{username}</h2>
            <p className="text-base text-gray-500">university {university}</p>
          </Card>

          {/* Empty space for first row */}
          <div></div>

          {/* Predicate Card */}
          <PredicateCard studentId={userId} />
        </div>
      </div>
      <div>
        <StudentPerformanceChart studentId={userId} />
        <div className="px-4">
          <AcademicForm studentId={userId} />
        </div>
      </div>
    </>
  );
};

export default DashboardStudent;
