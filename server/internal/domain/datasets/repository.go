package datasets

import (
	"context"
	"fmt"
	"math/rand"
	"time"
	"tsukamoto/internal/models"
	"tsukamoto/internal/utils"

	"gorm.io/gorm"
)

// academicRepository implements AcademicRepository interface
type academicRepository struct {
	db *gorm.DB
}

// NewAcademicRepository creates a new instance of academicRepository
func NewAcademicRepository(db *gorm.DB) AcademicRepository {
	return &academicRepository{db: db}
}

// ImportCSV saves academic records to the database, committing every 10 records
func (r *academicRepository) ImportCSV(ctx context.Context, academics []models.Academic) error {
	// Seed random number generator for university names
	rand.Seed(time.Now().UnixNano())
	universityNames := []string{"A", "B", "C"}

	// Process records in batches of 10
	batchSize := 10
	for i := 0; i < len(academics); i += batchSize {
		// Begin transaction for each batch
		tx := r.db.WithContext(ctx).Begin()
		if tx.Error != nil {
			return tx.Error
		}

		// Determine the end index for the current batch
		end := i + batchSize
		if end > len(academics) {
			end = len(academics)
		}

		// Process each academic record in the batch
		for j := i; j < end; j++ {
			academic := academics[j]

			// Create or get user based on StudentID
			username := fmt.Sprintf("student%d", academic.UserID)
			plainPassword := username // Password sama dengan username
			hashedPassword := utils.HashPassword(plainPassword)

			user := models.User{
				Username: username,
				Name:     username,
				Password: hashedPassword, // Gunakan password yang sudah di-hash
				Role:     "student",
			}

			// Check if user exists, if not create one
			var existingUser models.User
			if err := tx.Where("username = ?", username).First(&existingUser).Error; err == gorm.ErrRecordNotFound {
				if err := tx.Create(&user).Error; err != nil {
					tx.Rollback()
					return err
				}
				academics[j].UserID = uint(user.ID)
			} else if err != nil {
				tx.Rollback()
				return err
			} else {
				academics[j].UserID = uint(existingUser.ID)
			}

			// Create university with random name
			university := models.University{
				Name:    universityNames[rand.Intn(len(universityNames))],
				Address: "", // Leave address empty
			}
			if err := tx.Create(&university).Error; err != nil {
				tx.Rollback()
				return err
			}
			academics[j].UniversityID = uint(university.ID)

			// Insert academic record
			if err := tx.Create(&academics[j]).Error; err != nil {
				tx.Rollback()
				return err
			}
		}

		// Commit transaction for the current batch
		if err := tx.Commit().Error; err != nil {
			return err
		}
	}

	return nil
}

// GetAll retrieves all academic records from the database
func (r *academicRepository) GetAll(ctx context.Context) ([]models.Academic, error) {
	var academics []models.Academic
	err := r.db.WithContext(ctx).Find(&academics).Error
	return academics, err
}
