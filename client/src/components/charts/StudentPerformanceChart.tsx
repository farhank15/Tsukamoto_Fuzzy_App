import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getFuzzyCalculation } from "@/lib/api";
import { useEffect } from "react";

type StudentPerformanceChartProps = {
  studentId?: string;
};

export function StudentPerformanceChart({
  studentId,
}: StudentPerformanceChartProps) {
  const userId = studentId ? Number(studentId) : undefined;

  const { data: fuzzyData } = useQuery({
    queryKey: ["fuzzy", userId],
    queryFn: () => getFuzzyCalculation(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    console.log(
      "StudentPerformanceChart studentId:",
      studentId,
      "userId:",
      userId
    );
    console.log("Fuzzy data:", fuzzyData);
  }, [studentId, userId, fuzzyData]);

  // Transform actual performance data
  const performanceData = fuzzyData
    ? [
        {
          name: "GPA",
          value: (fuzzyData.data.inputs.gpa / 4) * 100,
          fullMark: 100,
        },
        { name: "CCA", value: fuzzyData.data.inputs.cca, fullMark: 100 },
        {
          name: "Attendance",
          value: fuzzyData.data.inputs.attendance * 100,
          fullMark: 100,
        },
        {
          name: "Midterm",
          value: fuzzyData.data.inputs.midterm,
          fullMark: 100,
        },
        {
          name: "Final Exam",
          value: fuzzyData.data.inputs.final_exam,
          fullMark: 100,
        },
      ]
    : [];

  // Transform inference output data for visualization
  const inferenceData = fuzzyData
    ? [
        {
          variable: "Categories",
          "Needs Improvement":
            fuzzyData.data.inference_output["Needs Improvement"],
          Satisfactory: fuzzyData.data.inference_output.Satisfactory,
          Good: fuzzyData.data.inference_output.Good,
          Excellent: fuzzyData.data.inference_output.Excellent,
          Poor: fuzzyData.data.inference_output.Poor,
        },
      ]
    : [];

  // Transform fuzzy membership data for chart
  const membershipData = fuzzyData
    ? [
        {
          name: "GPA",
          Low: fuzzyData.data.fuzzy_membership.gpa.low,
          Medium: fuzzyData.data.fuzzy_membership.gpa.medium,
          High: fuzzyData.data.fuzzy_membership.gpa.high,
        },
        {
          name: "CCA",
          Low: fuzzyData.data.fuzzy_membership.cca.low,
          Medium: fuzzyData.data.fuzzy_membership.cca.medium,
          High: fuzzyData.data.fuzzy_membership.cca.high,
        },
        {
          name: "Attendance",
          Low: fuzzyData.data.fuzzy_membership.attendance.low,
          Medium: fuzzyData.data.fuzzy_membership.attendance.medium,
          High: fuzzyData.data.fuzzy_membership.attendance.high,
        },
        {
          name: "Midterm",
          Low: fuzzyData.data.fuzzy_membership.midterm.low,
          Medium: fuzzyData.data.fuzzy_membership.midterm.medium,
          High: fuzzyData.data.fuzzy_membership.midterm.high,
        },
        {
          name: "Final Exam",
          Low: fuzzyData.data.fuzzy_membership.final_exam.low,
          Medium: fuzzyData.data.fuzzy_membership.final_exam.medium,
          High: fuzzyData.data.fuzzy_membership.final_exam.high,
        },
      ]
    : [];

  return (
    <div className="flex flex-wrap p-4 gap-4 w-full">
      <div className="flex flex-wrap gap-x-2 w-full">
        <Card className="p-6 w-full min-w-[320px] flex-1">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {performanceData.length > 0 ? (
                <RadarChart data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 w-full min-w-[320px] flex-1">
          <h3 className="text-lg font-semibold mb-4">Fuzzy Membership</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={membershipData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Low" fill="#ef4444" />
                <Bar dataKey="Medium" fill="#eab308" />
                <Bar dataKey="High" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 w-full min-w-[320px] flex-1">
        <h3 className="text-lg font-semibold mb-4">Performance</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inferenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="variable" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Poor" fill="#ef4444" />
              <Bar dataKey="Needs Improvement" fill="#f97316" />
              <Bar dataKey="Satisfactory" fill="#eab308" />
              <Bar dataKey="Good" fill="#10b981" />
              <Bar dataKey="Excellent" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
