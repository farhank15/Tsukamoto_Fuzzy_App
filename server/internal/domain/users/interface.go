package users

import (
	"context"
	"net/http"
	"tsukamoto/internal/models"
)

type UserRepository interface {
	Create(ctx context.Context, user models.User) error
	Update(ctx context.Context, id int, user models.User) error
	Delete(ctx context.Context, id int) error
	GetAll(ctx context.Context) ([]models.User, error)
	GetByID(ctx context.Context, id int) (*models.User, error)
}

type UserHandler interface {
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
	GetAll(w http.ResponseWriter, r *http.Request)
	GetByID(w http.ResponseWriter, r *http.Request)
}
