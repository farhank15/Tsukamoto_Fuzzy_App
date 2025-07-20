package university

import (
	"context"
	"net/http"
	"tsukamoto/internal/models"
)

type UniversityRepository interface {
	GetAll(ctx context.Context) ([]models.University, error)
	GetByID(ctx context.Context, id int) (*models.University, error)
}

type UniversityHandler interface {
	GetAll(w http.ResponseWriter, r *http.Request)
	GetByID(w http.ResponseWriter, r *http.Request)
}
