package university

import (
	"context"
	"errors"
	"tsukamoto/internal/models"

	"gorm.io/gorm"
)

type universityRepository struct {
	db *gorm.DB
}

func NewUniversityRepository(db *gorm.DB) UniversityRepository {
	return &universityRepository{db: db}
}

func (r *universityRepository) GetAll(ctx context.Context) ([]models.University, error) {
	var universities []models.University
	err := r.db.WithContext(ctx).Find(&universities).Error
	return universities, err
}

func (r *universityRepository) GetByID(ctx context.Context, id int) (*models.University, error) {
	var university models.University
	err := r.db.WithContext(ctx).First(&university, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("university not found")
	}
	return &university, err
}
