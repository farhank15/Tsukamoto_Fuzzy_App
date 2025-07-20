package datasets

import (
	"context"
	"net/http"
	"tsukamoto/internal/models"
)

// AcademicRepository defines the interface for academic data operations
type AcademicRepository interface {
	ImportCSV(ctx context.Context, academics []models.Academic) error
	GetAll(ctx context.Context) ([]models.Academic, error)
}

// AcademicHandler defines the interface for handling academic HTTP requests
type AcademicHandler interface {
	ImportCSV(w http.ResponseWriter, r *http.Request)
	GetAll(w http.ResponseWriter, r *http.Request)
}
