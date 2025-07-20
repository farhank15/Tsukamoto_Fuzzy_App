package university

import (
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func UniversityRoute(r *mux.Router, db *gorm.DB) {
	repo := NewUniversityRepository(db)
	handler := NewUniversityHandler(repo)

	r.HandleFunc("/university", handler.GetAll).Methods("GET")
	r.HandleFunc("/university/{id}", handler.GetByID).Methods("GET")
}
