export type ApiError = {
  message: string;
  status: number;
};

export type AcademicUpdateRequest = {
  core_course_average: number;
  attendance_rate: number;
  final_exam_score: number;
  gpa: number;
  midterm_exam_score: number;
};

export type AcademicRecord = {
  id: number;
  student_id: number;
  university_id: number;
  core_course_average: number;
  attendance_rate: number;
  final_exam_score: number;
  gpa: number;
  midterm_exam_score: number;
};

export type AcademicFormState = {
  student_id: number;
  university_id: number;
  core_course_average: string | number | "";
  attendance_rate: string | number | "";
  final_exam_score: string | number | "";
  gpa: string | number | "";
  midterm_exam_score: string | number | "";
};

export type AcademicRequest = {
  student_id: number;
  university_id: number;
  core_course_average: number;
  attendance_rate: number;
  final_exam_score: number;
  gpa: number;
  midterm_exam_score: number;
};
