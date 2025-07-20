package datasets

import (
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// DatasetsRoute mengatur rute untuk dataset akademik menggunakan Gorilla Mux
func DatasetsRoute(r *mux.Router, db *gorm.DB) {
	academicRepo := NewAcademicRepository(db)
	academicHandler := NewAcademicHandler(academicRepo)

	// Rute untuk mengimpor CSV
	r.HandleFunc("/datasets/import", academicHandler.ImportCSV).Methods("POST")

	// Rute untuk mengambil semua data akademik
	r.HandleFunc("/datasets", academicHandler.GetAll).Methods("GET")
}
