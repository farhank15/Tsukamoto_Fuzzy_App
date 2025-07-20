package datasets

import (
	"tsukamoto/internal/models"
)

type AcademicDTO struct {
	StudentID              uint    `json:"student_id" csv:"Student ID"`
	UniversityID           uint    `json:"university_id" csv:"University ID"`
	GPA                    float32 `json:"gpa" csv:"GPA"`
	CoreCourseAverage      float32 `json:"core_course_average" csv:"Core Course Average"`
	AttendanceRate         float32 `json:"attendance_score" csv:"Attendance Rate"` // Ubah ke float64
	FinalExamScore         float32 `json:"final_exam_score" csv:"Final Exam Scores"`
	MidtermExamScore       float32 `json:"midterm_exam_score" csv:"Midterm Exam Scores"`
	ProjectAssignmentScore float32 `json:"project_assignment_score" csv:"Project/Assignment Scores"`
}

// ToModel converts DTO to Academic model
func (dto *AcademicDTO) ToModel(userID uint) models.Academic {
	return models.Academic{
		UserID:            userID,
		UniversityID:      dto.UniversityID,
		GPA:               dto.GPA,
		CoreCourseAverage: dto.CoreCourseAverage,
		AttendanceRate:    dto.AttendanceRate,
		FinalExamScore:    dto.FinalExamScore,
		MidtermExamScore:  dto.MidtermExamScore,
	}
}
