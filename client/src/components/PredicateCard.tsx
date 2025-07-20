import { Card } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFuzzyCalculation } from "@/lib/api";
import type { FuzzyResponse } from "@/types/fuzzy";
import axios from "axios";

type PredicateCardProps = {
  studentId?: string;
};

export function PredicateCard({ studentId }: PredicateCardProps) {
  const userId = studentId ? Number(studentId) : undefined;

  const { data, isLoading, error, refetch } = useQuery<FuzzyResponse>({
    queryKey: ["fuzzy", userId],
    queryFn: () => getFuzzyCalculation(userId!),
    enabled: !!userId,
    staleTime: 30000, // Cache data for 30 seconds
    retry: false, // Don't retry on failure
  });

  let content = "Please fill in academic data first";
  let showInputs = false;
  let showRefresh = false; // Hide refresh by default

  if (isLoading) {
    content = "Calculating...";
  } else if (error) {
    // Check if it's a 404 error or no data error
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      content = "Please fill in academic data first";
    } else {
      content = "Something went wrong";
      showRefresh = true;
    }
  } else if (data?.data?.category) {
    content = data.data.category;
    showInputs = true;
    showRefresh = true;
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{content}</h2>
          {showInputs && data?.data?.inputs && (
            <div className="text-sm text-gray-500 mt-1">
              GPA: {data.data.inputs.gpa.toFixed(2)} | CCA:{" "}
              {data.data.inputs.cca.toFixed(2)} | Att:{" "}
              {data.data.inputs.attendance.toFixed(2)} | Mx:{" "}
              {data.data.inputs.midterm.toFixed(2)} | Fx:{" "}
              {data.data.inputs.final_exam.toFixed(2)}
            </div>
          )}
        </div>
        {showRefresh && (
          <button
            type="button"
            onClick={() => refetch()}
            className="focus:outline-none disabled:opacity-50"
            disabled={isLoading}
          >
            <RefreshCcw
              className={`w-6 h-6 cursor-pointer text-slate-500 hover:text-slate-700 transition-all ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        )}
      </div>
    </Card>
  );
}
