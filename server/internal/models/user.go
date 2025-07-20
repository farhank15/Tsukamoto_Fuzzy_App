package models

import (
	"time"
	password "tsukamoto/internal/utils"

	"gorm.io/gorm"
)

type User struct {
	ID        int       `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Username  string    `json:"username" gorm:"size:50;unique;not null"`
	Name      string    `json:"name" gorm:"size:50"`
	Password  string    `json:"-" gorm:"size:255;not null"`
	Role      string    `json:"role" gorm:"size:20;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// SeederAdminUser membuat user admin jika belum ada
func SeederAdminUser(db *gorm.DB) error {
	var count int64
	db.Model(&User{}).Where("username = ?", "admin").Count(&count)
	if count == 0 {
		admin := User{
			Username: "admin",
			Name:     "Administrator",
			Password: password.HashPassword("admin123"),
			Role:     "admin",
		}
		return db.Create(&admin).Error
	}
	return nil
}
