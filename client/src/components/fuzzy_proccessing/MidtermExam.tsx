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

// Fungsi fuzzifikasi berdasarkan kode Go untuk MES
const fuzzifyMESLow = (midterm: number): number => {
  if (midterm <= 55) return 1.0;
  if (midterm <= 60) return (60 - midterm) / (60 - 55);
  return 0.0;
};

const fuzzifyMESMedium = (midterm: number): number => {
  if (midterm >= 55 && midterm <= 65) return (midterm - 55) / (65 - 55);
  if (midterm > 65 && midterm <= 75) return (75 - midterm) / (75 - 65);
  return 0.0;
};

const fuzzifyMESHigh = (midterm: number): number => {
  if (midterm >= 80) return 1.0;
  if (midterm >= 70) return (midterm - 70) / (80 - 70);
  return 0.0;
};

// Generate data untuk grafik
const mesValues = Array.from({ length: 1001 }, (_, i) => i / 10); // [0, 100] dengan 1001 titik
const chartData = mesValues.map((x) => ({
  midterm: x,
  low: fuzzifyMESLow(x),
  medium: fuzzifyMESMedium(x),
  high: fuzzifyMESHigh(x),
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

const MESFuzzificationDisplay: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Card className="max-w-6xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Fuzzifikasi Nilai Ujian Tengah Semester (MES)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Informasi Domain dan Range */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Informasi Domain dan Range
            </h2>
            <p className="text-gray-600">
              <strong>Domain:</strong> [0, 100] (skor ujian tengah semester,
              mewakili 0 hingga 100).
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
                  • Maksimal hingga skor MES 55
                  <br />
                  • Menurun linear dari 55–60
                  <br />• Nol setelah 60
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-700 mb-2">
                  Medium (Needs Improvement, Satisfactory)
                </h3>
                <p className="text-gray-600">
                  • Naik linear dari 55–65
                  <br />
                  • Turun linear dari 65–75
                  <br />• Bentuk segitiga
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2">
                  High (Good, Excellent)
                </h3>
                <p className="text-gray-600">
                  • Nol hingga 70
                  <br />
                  • Naik linear dari 70–80
                  <br />• Maksimal setelah 80
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
                      dataKey="midterm"
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v.toFixed(0)}`}
                      label={{
                        value: "Skor MES",
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
                        `Skor MES: ${
                          typeof value === "number" ? value.toFixed(1) : "N/A"
                        }`
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
                <h3 className="font-semibold mb-2">Skor MES 58</h3>
                <p>• Low: {fuzzifyMESLow(58).toFixed(3)}</p>
                <p>• Medium: {fuzzifyMESMedium(58).toFixed(3)}</p>
                <p>• High: {fuzzifyMESHigh(58).toFixed(3)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Skor MES 72</h3>
                <p>• Low: {fuzzifyMESLow(72).toFixed(3)}</p>
                <p>• Medium: {fuzzifyMESMedium(72).toFixed(3)}</p>
                <p>• High: {fuzzifyMESHigh(72).toFixed(3)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MESFuzzificationDisplay;
