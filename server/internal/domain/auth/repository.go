package auth

import (
	"context"
	"tsukamoto/internal/models"

	"gorm.io/gorm"
)

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(ctx).Where("username = ?", username).First(&user).Error
	return &user, err
}

func (r *authRepository) GetUserAcademic(ctx context.Context, userID int) (*models.Academic, error) {
	var academic models.Academic
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Preload("University").
		First(&academic).Error
	return &academic, err
}

func (r *authRepository) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	err := r.db.WithContext(ctx).Create(user).Error
	return user, err
}

func (r *authRepository) GetUniversityByID(ctx context.Context, id int) (*models.University, error) {
	var university models.University
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&university).Error
	return &university, err
}

func (r *authRepository) CreateUniversity(ctx context.Context, university *models.University) (*models.University, error) {
	err := r.db.WithContext(ctx).Create(university).Error
	return university, err
}

func (r *authRepository) GetAllUniversities(ctx context.Context) ([]models.University, error) {
	var universities []models.University
	err := r.db.WithContext(ctx).Find(&universities).Error
	return universities, err
}

func (r *authRepository) CreateAcademic(ctx context.Context, academic *models.Academic) (*models.Academic, error) {
	err := r.db.WithContext(ctx).Create(academic).Error
	return academic, err
}

// Method terpisah untuk get university info (tetap dipertahankan untuk backward compatibility)
func (r *authRepository) GetUserUniversity(ctx context.Context, userID int) (*models.Academic, error) {
	var academic models.Academic
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Preload("University").
		First(&academic).Error
	return &academic, err
}
