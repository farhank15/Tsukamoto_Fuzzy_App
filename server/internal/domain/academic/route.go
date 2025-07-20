package academic

import (
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func AcademicRoute(r *mux.Router, db *gorm.DB) {
	repo := NewAcademicRepository(db)
	handler := NewAcademicHandler(repo)

	r.HandleFunc("/academic", handler.Create).Methods("POST")
	r.HandleFunc("/academic/{id}", handler.Update).Methods("PUT")
	r.HandleFunc("/academic", handler.GetAll).Methods("GET")
	r.HandleFunc("/academic/student/{student_id}", handler.GetByStudentID).Methods("GET")
}
