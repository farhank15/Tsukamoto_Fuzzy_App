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

// Fungsi fuzzifikasi berdasarkan kode Go untuk CCA
const fuzzifyCCALow = (cca: number): number => {
  if (cca <= 50) return 1.0;
  if (cca <= 55) return (55 - cca) / (55 - 50);
  return 0.0;
};

const fuzzifyCCAMedium = (cca: number): number => {
  if (cca >= 50 && cca <= 65) return (cca - 50) / (65 - 50);
  if (cca > 65 && cca <= 75) return (75 - cca) / (75 - 65);
  return 0.0;
};

const fuzzifyCCAHigh = (cca: number): number => {
  if (cca >= 80) return 1.0;
  if (cca >= 70) return (cca - 70) / (80 - 70);
  return 0.0;
};

// Generate data untuk grafik
const ccaValues = Array.from({ length: 1001 }, (_, i) => i / 10); // [0, 100] dengan 1001 titik
const chartData = ccaValues.map((x) => ({
  cca: x,
  low: fuzzifyCCALow(x),
  medium: fuzzifyCCAMedium(x),
  high: fuzzifyCCAHigh(x),
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

const CCAFuzzificationDisplay: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Fuzzifikasi Kontribusi Kelas (CCA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Informasi Domain dan Range */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Informasi Domain dan Range
            </h2>
            <p className="text-gray-600">
              <strong>Domain:</strong> [0, 100] (skor kontribusi kelas, mewakili
              0 hingga 100).
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
                  • Maksimal hingga skor CCA 50
                  <br />
                  • Menurun linear dari 50–55
                  <br />• Nol setelah 55
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-700 mb-2">
                  Medium (Needs Improvement, Satisfactory)
                </h3>
                <p className="text-gray-600">
                  • Naik linear dari 50–65
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
            <div className="w-full max-w-4xl mx-auto h-96">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 40, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="cca"
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v.toFixed(0)}`}
                      label={{
                        value: "Skor CCA",
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
                        `Skor CCA: ${
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
                <h3 className="font-semibold mb-2">Skor CCA 52</h3>
                <p>• Low: {fuzzifyCCALow(52).toFixed(3)}</p>
                <p>• Medium: {fuzzifyCCAMedium(52).toFixed(3)}</p>
                <p>• High: {fuzzifyCCAHigh(52).toFixed(3)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Skor CCA 72</h3>
                <p>• Low: {fuzzifyCCALow(72).toFixed(3)}</p>
                <p>• Medium: {fuzzifyCCAMedium(72).toFixed(3)}</p>
                <p>• High: {fuzzifyCCAHigh(72).toFixed(3)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CCAFuzzificationDisplay;
