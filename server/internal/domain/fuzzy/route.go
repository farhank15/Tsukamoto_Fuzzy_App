package fuzzy

import (
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// RegisterRoutes registers fuzzy routes
func FuzzyRoute(r *mux.Router, db *gorm.DB) {
	handler := NewHandler(db)
	r.HandleFunc("/fuzzy/{id}", handler.FuzzyByUserID).Methods("GET")
}
