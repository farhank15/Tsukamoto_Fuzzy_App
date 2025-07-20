package auth

import (
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func AuthRoute(r *mux.Router, db *gorm.DB) {
	repo := NewAuthRepository(db)
	handler := NewAuthHandler(repo)

	r.HandleFunc("/auth/login", handler.Login).Methods("POST")
	r.HandleFunc("/auth/register", handler.Register).Methods("POST")
}
