import type { FuzzyResponse } from "@/types/fuzzy";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getFuzzyCalculation(
  userId: number
): Promise<FuzzyResponse> {
  const response = await fetch(`${API_BASE_URL}/fuzzy/${userId}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
}
