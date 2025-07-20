package models

import (
	"time"

	"gorm.io/gorm"
)

type Academic struct {
    ID                int            `json:"id" gorm:"primaryKey;autoIncrement;not null"`
    UniversityID      uint           `json:"university_id" gorm:"column:university_id;not null"`
    University        University     `json:"university,omitempty" gorm:"foreignKey:UniversityID;references:ID"`
    UserID            uint           `json:"user_id" gorm:"column:user_id;not null"`
    User              User           `json:"user,omitempty" gorm:"foreignKey:UserID;references:ID"`
    CoreCourseAverage float32        `json:"core_course_average" gorm:"column:core_course_average;type:float"`
    AttendanceRate    float32        `json:"attendance_rate" gorm:"column:attendance_rate;type:float"`
    FinalExamScore    float32        `json:"final_exam_score" gorm:"column:final_exam_score;type:float"`
    GPA               float32        `json:"gpa" gorm:"column:gpa;type:float"`
    MidtermExamScore  float32        `json:"midterm_exam_score" gorm:"column:midterm_exam_score;type:float"`
    CreatedAt         time.Time      `json:"created_at" gorm:"autoCreateTime"`
    UpdatedAt         time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
    DeletedAt         gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}