import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const BASE_URL = import.meta.env.VITE_BASE_URL_API;

const COLORS = [
  "rgba(37,99,235,0.5)", // blue-600
  "rgba(234,179,8,0.5)", // yellow-400
  "rgba(16,185,129,0.5)", // green-500
  "rgba(239,68,68,0.5)", // red-500
  "rgba(59,130,246,0.5)", // blue-500
  "rgba(168,85,247,0.5)", // purple-500
  "rgba(251,191,36,0.5)", // yellow-300
];

// Define interface for student data
interface StudentData {
  name: string;
  gpa: number;
  attendance: number;
  midterm: number;
  final: number;
  project: number;
  core: number;
  category: string;
}

export function StudentStatistics() {
  const { data } = useQuery({
    queryKey: ["all-students"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/academic`, {
        params: { limit: 1000 },
      });
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;
      throw new Error("Unexpected API response");
    },
  });

  // Prepare data for charts
  const gpaData: StudentData[] =
    data?.map((s: any) => ({
      name: s.user?.name ?? "-",
      gpa: s.gpa ?? 0,
      attendance: s.attendance_rate ?? 0,
      midterm: s.midterm_exam_score ?? 0,
      final: s.final_exam_score ?? 0,
      project: s.project_assignment_score ?? 0,
      core: s.core_course_average ?? 0,
      category:
        s.category ?? s.predikat ?? s.predicate ?? s?.data?.category ?? "-",
    })) ?? [];

  // University distribution
  const universityCount: Record<string, number> = {};
  data?.forEach((s: any) => {
    const univ = s.university?.name ?? "-";
    universityCount[univ] = (universityCount[univ] || 0) + 1;
  });
  const universityData = Object.entries(universityCount).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Averages
  const avg = (
    key: keyof Pick<
      StudentData,
      "gpa" | "attendance" | "midterm" | "final" | "project" | "core"
    >
  ) =>
    gpaData.length > 0
      ? (
          gpaData.reduce(
            (sum: number, s: StudentData) => sum + (s[key] ?? 0),
            0
          ) / gpaData.length
        ).toFixed(2)
      : "0.00";

  // GPA Distribution (bucketed)
  const gpaBuckets = [0, 1, 2, 3, 4];
  const gpaDist = gpaBuckets.map((min, i) => {
    const max = gpaBuckets[i + 1] ?? 4.01;
    const count = gpaData.filter((s) => s.gpa >= min && s.gpa < max).length;
    return { range: `${min} - ${max === 4.01 ? 4 : max}`, count };
  });

  // Radar data for average
  const radarData = [
    { subject: "GPA", value: Number(avg("gpa")), fullMark: 100 },
    {
      subject: "Attendance",
      value: Number(avg("attendance")) * 100,
      fullMark: 100,
    },
    { subject: "Midterm", value: Number(avg("midterm")), fullMark: 100 },
    { subject: "Final", value: Number(avg("final")), fullMark: 100 },
    { subject: "Project", value: Number(avg("project")), fullMark: 100 },
    { subject: "Core", value: Number(avg("core")), fullMark: 100 },
  ];

  // Hapus distribusi predikat, ganti dengan statistik baru: Top 10 GPA
  const topGPAData = [...gpaData].sort((a, b) => b.gpa - a.gpa).slice(0, 10);

  // Statistik tambahan: Rata-rata GPA per universitas
  const avgGPAByUniversity = universityData.map((u) => {
    const students = gpaData.filter((s) => {
      const studentUniv =
        data?.find((d: any) => d.user?.name === s.name)?.university?.name ??
        "-";
      return studentUniv === u.name;
    });
    const avg =
      students.length > 0
        ? (
            students.reduce((sum, s) => sum + (s.gpa ?? 0), 0) / students.length
          ).toFixed(2)
        : "0.00";
    return { university: u.name, avgGPA: Number(avg) };
  });

  // Statistik tambahan: Jumlah mahasiswa per rentang nilai akhir (final)
  const finalBuckets = [0, 50, 60, 70, 80, 100];
  const finalDist = finalBuckets.map((min, i) => {
    const max = finalBuckets[i + 1] ?? 100.01;
    const count = gpaData.filter((s) => s.final >= min && s.final < max).length;
    return { range: `${min} - ${max === 100.01 ? 100 : max}`, count };
  });

  // Statistik tambahan: Jumlah mahasiswa per rentang attendance
  const attendanceBuckets = [0, 0.5, 0.7, 0.85, 1];
  const attendanceDist = attendanceBuckets.map((min, i) => {
    const max = attendanceBuckets[i + 1] ?? 1.01;
    const count = gpaData.filter(
      (s) => s.attendance >= min && s.attendance < max
    ).length;
    return {
      range: `${(min * 100).toFixed(0)}% - ${(max === 1.01 ? 100 : max * 100).toFixed(0)}%`,
      count,
    };
  });

  // Statistik baru: Jumlah mahasiswa per core course average bucket
  const coreBuckets = [0, 50, 60, 70, 80, 100];
  const coreDist = coreBuckets.map((min, i) => {
    const max = coreBuckets[i + 1] ?? 100.01;
    const count = gpaData.filter((s) => s.core >= min && s.core < max).length;
    return { range: `${min} - ${max === 100.01 ? 100 : max}`, count };
  });

  // Statistik baru: Jumlah mahasiswa per project assignment score bucket
  const projectBuckets = [0, 50, 60, 70, 80, 100];
  const projectDist = projectBuckets.map((min, i) => {
    const max = projectBuckets[i + 1] ?? 100.01;
    const count = gpaData.filter(
      (s) => s.project >= min && s.project < max
    ).length;
    return { range: `${min} - ${max === 100.01 ? 100 : max}`, count };
  });

  // Statistik baru: Jumlah mahasiswa per midterm score bucket
  const midtermBuckets = [0, 50, 60, 70, 80, 100];
  const midtermDist = midtermBuckets.map((min, i) => {
    const max = midtermBuckets[i + 1] ?? 100.01;
    const count = gpaData.filter(
      (s) => s.midterm >= min && s.midterm < max
    ).length;
    return { range: `${min} - ${max === 100.01 ? 100 : max}`, count };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <Card className="p-6 flex-1 min-w-[220px] bg-white/70 shadow">
          <h2 className="text-xl font-bold mb-2">Rata-rata GPA</h2>
          <div className="text-3xl font-bold">{avg("gpa")}</div>
        </Card>
        <Card className="p-6 flex-1 min-w-[220px] bg-white/70 shadow">
          <h2 className="text-xl font-bold mb-2">Rata-rata Attendance</h2>
          <div className="text-3xl font-bold">
            {(Number(avg("attendance")) * 100).toFixed(2)}%
          </div>
        </Card>
        <Card className="p-6 flex-1 min-w-[220px] bg-white/70 shadow">
          <h2 className="text-xl font-bold mb-2">Rata-rata Midterm</h2>
          <div className="text-3xl font-bold">{avg("midterm")}</div>
        </Card>
        <Card className="p-6 flex-1 min-w-[220px] bg-white/70 shadow">
          <h2 className="text-xl font-bold mb-2">Rata-rata Final</h2>
          <div className="text-3xl font-bold">{avg("final")}</div>
        </Card>
        <Card className="p-6 flex-1 min-w-[220px] bg-white/70 shadow">
          <h2 className="text-xl font-bold mb-2">Rata-rata Project</h2>
          <div className="text-3xl font-bold">{avg("project")}</div>
        </Card>
        <Card className="p-6 flex-1 min-w-[220px] bg-white/70 shadow">
          <h2 className="text-xl font-bold mb-2">Rata-rata Core Course</h2>
          <div className="text-3xl font-bold">{avg("core")}</div>
        </Card>
        <Card className="p-6 flex-1 min-w-[220px] bg-white/70 shadow">
          <h2 className="text-xl font-bold mb-2">Total Student</h2>
          <div className="text-3xl font-bold">{gpaData.length}</div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">Distribusi GPA</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(37,99,235,0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Jumlah Student per Universitas
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={universityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {universityData.map((_, idx) => (
                    <Cell
                      key={`cell-univ-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Top 10 Mahasiswa Berdasarkan GPA
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topGPAData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 4]} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="gpa" fill="rgba(16,185,129,0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Rata-rata GPA per Universitas
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgGPAByUniversity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="university" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Bar dataKey="avgGPA" fill="rgba(234,179,8,0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Distribusi Nilai Akhir (Final Exam)
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(239,68,68,0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Distribusi Attendance (%)
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(59,130,246,0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Distribusi Core Course Average
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coreDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(168,85,247,0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Distribusi Project Assignment Score
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(251,191,36,0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex-1 min-w-[320px] bg-white/70 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Distribusi Midterm Exam Score
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={midtermDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(234,179,8,0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white/70 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Rata-rata Nilai Mahasiswa (Radar)
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Average"
                dataKey="value"
                stroke="rgba(37,99,235,0.8)"
                fill="rgba(37,99,235,0.3)"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
