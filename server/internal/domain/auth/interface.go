package auth

import (
	"context"
	"net/http"
	"tsukamoto/internal/models"
)

type AuthRepository interface {
	GetUserByUsername(ctx context.Context, username string) (*models.User, error)
	GetUserAcademic(ctx context.Context, userID int) (*models.Academic, error)
	CreateUser(ctx context.Context, user *models.User) (*models.User, error)
	GetUniversityByID(ctx context.Context, id int) (*models.University, error)
	CreateUniversity(ctx context.Context, university *models.University) (*models.University, error)
	GetAllUniversities(ctx context.Context) ([]models.University, error)
	CreateAcademic(ctx context.Context, academic *models.Academic) (*models.Academic, error)
}

type AuthHandler interface {
	Login(w http.ResponseWriter, r *http.Request)
	Register(w http.ResponseWriter, r *http.Request)
	GetUniversities(w http.ResponseWriter, r *http.Request)
}
