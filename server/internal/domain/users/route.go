package users

import (
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func UserRoute(r *mux.Router, db *gorm.DB) {
	repo := NewUserRepository(db)
	handler := NewUserHandler(repo)

	r.HandleFunc("/users", handler.Create).Methods("POST")
	r.HandleFunc("/users/{id}", handler.Update).Methods("PUT")
	r.HandleFunc("/users/{id}", handler.Delete).Methods("DELETE")
	r.HandleFunc("/users", handler.GetAll).Methods("GET")
	r.HandleFunc("/users/{id}", handler.GetByID).Methods("GET")
}
