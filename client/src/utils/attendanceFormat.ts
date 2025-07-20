// utils/attendanceFormat.ts

/**
 * Convert percentage value to decimal for database storage
 * Input: 60 (user input) -> Output: 0.60 (for database)
 */
export function percentageToDecimal(percentage: string | number): number {
  const num = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  return num / 100;
}

/**
 * Convert decimal value to percentage for display
 * Input: 0.60 (from database) -> Output: 60 (for display)
 */
export function decimalToPercentage(decimal: string | number): number {
  const num = typeof decimal === 'string' ? parseFloat(decimal) : decimal;
  return num * 100;
}

/**
 * Format attendance rate from database for form initialization
 * Input: 0.60 -> Output: "60"
 */
export function formatAttendanceForForm(value: number): string {
  return decimalToPercentage(value).toString();
}

/**
 * Parse attendance rate from form input for API submission
 * Input: "60" -> Output: 0.60
 */
export function parseAttendanceForSubmit(value: string): number {
  return percentageToDecimal(value || "0");
}