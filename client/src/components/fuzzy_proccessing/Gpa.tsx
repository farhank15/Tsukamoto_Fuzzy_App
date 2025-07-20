import React from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Fungsi fuzzifikasi berdasarkan kode Go untuk GPA
const fuzzifyGPALow = (gpa: number): number => {
  if (gpa <= 1.8) return 1.0;
  if (gpa <= 2.2) return (2.2 - gpa) / (2.2 - 1.8);
  return 0.0;
};

const fuzzifyGPAMedium = (gpa: number): number => {
  if (gpa >= 1.8 && gpa <= 2.5) return (gpa - 1.8) / (2.5 - 1.8);
  if (gpa > 2.5 && gpa <= 3.2) return (3.2 - gpa) / (3.2 - 2.5);
  return 0.0;
};

const fuzzifyGPAHigh = (gpa: number): number => {
  if (gpa >= 3.2) return 1.0;
  if (gpa >= 2.8) return (gpa - 2.8) / (3.2 - 2.8);
  return 0.0;
};

// Generate data untuk grafik
const gpaValues = Array.from({ length: 401 }, (_, i) => i / 100); // [0, 4] dengan 401 titik
const chartData = gpaValues.map((x) => ({
  gpa: x,
  low: fuzzifyGPALow(x),
  medium: fuzzifyGPAMedium(x),
  high: fuzzifyGPAHigh(x),
}));

// Konfigurasi warna dan label untuk Chart shadcn
const chartConfig = {
  low: {
    label: (
      <span>
        Low (<span className="text-red-500">Poor</span>)
      </span>
    ),
    color: "#ef4444", // red-500
  },
  medium: {
    label: (
      <span>
        Medium (
        <span className="text-green-500">Needs Improvement, Satisfactory</span>)
      </span>
    ),
    color: "#22c55e", // green-500
  },
  high: {
    label: (
      <span>
        High (<span className="text-blue-500">Good, Excellent</span>)
      </span>
    ),
    color: "#3b82f6", // blue-500
  },
};

const GPAFuzzificationDisplay: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Card className="max-w-6xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Fuzzifikasi IPK (GPA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Informasi Domain dan Range */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Informasi Domain dan Range
            </h2>
            <p className="text-gray-600">
              <strong>Domain:</strong> [0, 4] (Indeks Prestasi Kumulatif,
              mewakili 0 hingga 4).
            </p>
            <p className="text-gray-600">
              <strong>Range:</strong> [0, 1] (derajat keanggotaan untuk himpunan
              fuzzy <span className="text-red-500">Low</span>,{" "}
              <span className="text-green-500">Medium</span>, dan{" "}
              <span className="text-blue-500">High</span>).
            </p>
          </div>

          {/* Informasi Fungsi Keanggotaan */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Definisi Fungsi Keanggotaan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-700 mb-2">Low (Poor)</h3>
                <p className="text-gray-600">
                  • Maksimal hingga IPK 1.8
                  <br />
                  • Menurun linear dari 1.8–2.2
                  <br />• Nol setelah 2.2
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-700 mb-2">
                  Medium (Needs Improvement, Satisfactory)
                </h3>
                <p className="text-gray-600">
                  • Naik linear dari 1.8–2.5
                  <br />
                  • Turun linear dari 2.5–3.2
                  <br />• Bentuk segitiga
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2">
                  High (Good, Excellent)
                </h3>
                <p className="text-gray-600">
                  • Nol hingga 2.8
                  <br />
                  • Naik linear dari 2.8–3.2
                  <br />• Maksimal setelah 3.2
                </p>
              </div>
            </div>
          </div>

          {/* Grafik Interaktif dengan shadcn chart */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Grafik Interaktif
            </h2>
            <div className="w-full max-w-4xl mx-auto">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 40, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="gpa"
                      type="number"
                      domain={[0, 4]}
                      tickFormatter={(v) => `${v.toFixed(1)}`}
                      label={{
                        value: "IPK",
                        position: "insideBottom",
                        offset: -10,
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <YAxis
                      domain={[0, 1.05]}
                      tickFormatter={(v) => v.toFixed(1)}
                      label={{
                        value: "Derajat Keanggotaan",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Line
                      type="linear"
                      dataKey="low"
                      stroke={chartConfig.low.color}
                      dot={false}
                      strokeWidth={2}
                      name="Low"
                    />
                    <Line
                      type="linear"
                      dataKey="medium"
                      stroke={chartConfig.medium.color}
                      dot={false}
                      strokeWidth={2}
                      name="Medium"
                    />
                    <Line
                      type="linear"
                      dataKey="high"
                      stroke={chartConfig.high.color}
                      dot={false}
                      strokeWidth={2}
                      name="High"
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      labelFormatter={(value) =>
                        `IPK: ${typeof value === "number" ? value.toFixed(1) : "N/A"}`
                      }
                      formatter={(value, name) => [
                        `${Number(value).toFixed(3)}`,
                        name,
                      ]}
                    />
                    <ChartLegend
                      layout="horizontal"
                      verticalAlign="top"
                      align="center"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Contoh Perhitungan */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Contoh Perhitungan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">IPK 2.0</h3>
                <p>• Low: {fuzzifyGPALow(2.0).toFixed(3)}</p>
                <p>• Medium: {fuzzifyGPAMedium(2.0).toFixed(3)}</p>
                <p>• High: {fuzzifyGPAHigh(2.0).toFixed(3)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">IPK 3.0</h3>
                <p>• Low: {fuzzifyGPALow(3.0).toFixed(3)}</p>
                <p>• Medium: {fuzzifyGPAMedium(3.0).toFixed(3)}</p>
                <p>• High: {fuzzifyGPAHigh(3.0).toFixed(3)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPAFuzzificationDisplay;
