package models

import (
	"time"

	"gorm.io/gorm"
)

type University struct {
	ID        int            `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Name      string         `json:"name" gorm:"size:100;not null"`
	Address   string         `json:"address" gorm:"size:255;not null"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
