package academic

// Konsisten semua menggunakan float32 untuk menghindari precision loss
type CreateAcademicRequest struct {
	StudentID         uint    `json:"student_id"`
	UniversityID      uint    `json:"university_id"`
	CoreCourseAverage float32 `json:"core_course_average"`
	AttendanceRate    float32 `json:"attendance_rate"`
	FinalExamScore    float32 `json:"final_exam_score"`
	GPA               float32 `json:"gpa"`
	MidtermExamScore  float32 `json:"midterm_exam_score"`
}

type UpdateAcademicRequest struct {
	CoreCourseAverage float32 `json:"core_course_average"`
	AttendanceRate    float32 `json:"attendance_rate"`
	FinalExamScore    float32 `json:"final_exam_score"`
	GPA               float32 `json:"gpa"`
	MidtermExamScore  float32 `json:"midterm_exam_score"`
}

type AcademicResponse struct {
	ID                int     `json:"id"`
	StudentID         uint    `json:"student_id"`
	UniversityID      uint    `json:"university_id"`
	CoreCourseAverage float32 `json:"core_course_average"`
	AttendanceRate    float32 `json:"attendance_rate"`
	FinalExamScore    float32 `json:"final_exam_score"`
	GPA               float32 `json:"gpa"`
	MidtermExamScore  float32 `json:"midterm_exam_score"`
}

// Tambahkan response type untuk update yang mengembalikan data lengkap
type UpdateAcademicResponse struct {
	Message string           `json:"message"`
	Data    AcademicResponse `json:"data,omitempty"`
}