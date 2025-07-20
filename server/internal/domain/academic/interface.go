package academic

import (
	"context"
	"net/http"
	"tsukamoto/internal/models"
)

type AcademicRepository interface {
	Create(ctx context.Context, academic models.Academic) error
	Update(ctx context.Context, id int, academic models.Academic) error
	GetAll(ctx context.Context) ([]models.Academic, error)
	GetByStudentID(ctx context.Context, studentID uint) ([]models.Academic, error)
	GetByID(ctx context.Context, id int) (*models.Academic, error)
}

type AcademicHandler interface {
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	GetAll(w http.ResponseWriter, r *http.Request)
	GetByStudentID(w http.ResponseWriter, r *http.Request)
	GetByID(w http.ResponseWriter, r *http.Request)
}
