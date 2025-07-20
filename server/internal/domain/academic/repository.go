package academic

import (
	"context"
	"errors"
	"tsukamoto/internal/models"

	"gorm.io/gorm"
)

type academicRepository struct {
	db *gorm.DB
}

func NewAcademicRepository(db *gorm.DB) AcademicRepository {
	return &academicRepository{db: db}
}

func (r *academicRepository) Create(ctx context.Context, academic models.Academic) error {
	return r.db.WithContext(ctx).Create(&academic).Error
}

func (r *academicRepository) Update(ctx context.Context, id int, academic models.Academic) error {
	// Cek apakah record ada
	var existing models.Academic
	if err := r.db.WithContext(ctx).First(&existing, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("academic record not found")
		}
		return err
	}

	// Update hanya field yang tidak null
	result := r.db.WithContext(ctx).Model(&existing).Updates(academic)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows were updated")
	}

	return nil
}

func (r *academicRepository) GetAll(ctx context.Context) ([]models.Academic, error) {
	var academics []models.Academic
	err := r.db.WithContext(ctx).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, name, role, created_at, updated_at")
		}).
		Preload("University").
		Find(&academics).Error
	return academics, err
}

func (r *academicRepository) GetByStudentID(ctx context.Context, studentID uint) ([]models.Academic, error) {
	var academics []models.Academic
	err := r.db.WithContext(ctx).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, name, role, created_at, updated_at")
		}).
		Preload("University").
		Where("user_id = ?", studentID).
		Find(&academics).Error
	return academics, err
}

// Tambahkan method untuk get by ID
func (r *academicRepository) GetByID(ctx context.Context, id int) (*models.Academic, error) {
	var academic models.Academic
	err := r.db.WithContext(ctx).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, name, role, created_at, updated_at")
		}).
		Preload("University").
		First(&academic, id).Error
	
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("academic record not found")
	}
	
	return &academic, err
}