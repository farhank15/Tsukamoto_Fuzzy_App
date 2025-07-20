package users

import (
	"context"
	"tsukamoto/internal/models"

	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user models.User) error {
	return r.db.WithContext(ctx).Create(&user).Error
}

func (r *userRepository) Update(ctx context.Context, id int, user models.User) error {
	return r.db.WithContext(ctx).Model(&models.User{}).Where("id = ?", id).Updates(user).Error
}

func (r *userRepository) Delete(ctx context.Context, id int) error {
	return r.db.WithContext(ctx).Delete(&models.User{}, id).Error
}

func (r *userRepository) GetAll(ctx context.Context) ([]models.User, error) {
	var users []models.User
	err := r.db.WithContext(ctx).Find(&users).Error
	return users, err
}

func (r *userRepository) GetByID(ctx context.Context, id int) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(ctx).First(&user, id).Error
	return &user, err
}
