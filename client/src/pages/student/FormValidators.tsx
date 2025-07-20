import { z } from "zod";

export const gpaSchema = z
  .number({ invalid_type_error: "GPA must be a number" })
  .min(0, "GPA cannot be less than 0")
  .max(4, "GPA cannot be more than 4");

export const attendanceSchema = z
  .number({ invalid_type_error: "Attendance rate must be a number" })
  .min(0, "Attendance rate cannot be less than 0")
  .max(100, "Attendance rate cannot be more than 100");

export const midtermSchema = z
  .number({ invalid_type_error: "Midterm Exam Score must be a number" })
  .min(0, "Midterm Exam Score cannot be less than 0")
  .max(100, "Midterm Exam Score cannot be more than 100");

export const coreCourseSchema = z
  .number({ invalid_type_error: "Core Course Average must be a number" })
  .min(0, "Core Course Average cannot be less than 0")
  .max(100, "Core Course Average cannot be more than 100");

export const projectScoreSchema = z
  .number({ invalid_type_error: "Project Score must be a number" })
  .min(0, "Project Score cannot be less than 0")
  .max(100, "Project Score cannot be more than 100");

export const finalExamScoreSchema = z
  .number({ invalid_type_error: "Final Exam Score must be a number" })
  .min(0, "Final Exam Score cannot be less than 0")
  .max(100, "Final Exam Score cannot be more than 100");

export function validateGPA(value: string): true | string {
  const parsed = Number(value);
  const result = gpaSchema.safeParse(parsed);
  return result.success ? true : result.error.issues[0].message;
}

export function validateAttendance(value: string): true | string {
  const parsed = Number(value);
  const result = attendanceSchema.safeParse(parsed);
  return result.success ? true : result.error.issues[0].message;
}

export function validateMidterm(value: string): true | string {
  const parsed = Number(value);
  const result = midtermSchema.safeParse(parsed);
  return result.success ? true : result.error.issues[0].message;
}

export function validateCoreCourse(value: string): true | string {
  const parsed = Number(value);
  const result = coreCourseSchema.safeParse(parsed);
  return result.success ? true : result.error.issues[0].message;
}

export function validateProjectScore(value: string): true | string {
  const parsed = Number(value);
  const result = projectScoreSchema.safeParse(parsed);
  return result.success ? true : result.error.issues[0].message;
}

export function validateFinalExamScore(value: string): true | string {
  const parsed = Number(value);
  const result = finalExamScoreSchema.safeParse(parsed);
  return result.success ? true : result.error.issues[0].message;
}
