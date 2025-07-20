package main

import (
	"reflect"

	"tsukamoto/internal/models"

	"tsukamoto/config"

	"github.com/sirupsen/logrus"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg := config.LoadConfig()

	dsn := "host=" + cfg.DBHost +
		" user=" + cfg.DBUser +
		" password=" + cfg.DBPassword +
		" dbname=" + cfg.DBName +
		" port=" + cfg.DBPort +
		" sslmode=disable" +
		" search_path=" + cfg.DBSchema

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logrus.Fatalf("Failed to connect to database: %v", err)
	}

	logrus.Info("Running migrations...")
	if err := db.AutoMigrate(models.GetModelsToMigrate()...); err != nil {
		logrus.Fatalf("Migration failed: %v", err)
	}

	// Jalankan seeder admin user
	if err := models.SeederAdminUser(db); err != nil {
		logrus.Fatalf("Seeder admin gagal: %v", err)
	}

	// Log all migrated models
	modelNames := getModelNames(models.GetModelsToMigrate())
	logrus.Infof("Migrated models: %s", modelNames)

	logrus.Info("Migration and seeding completed successfully.")
}

// getModelNames returns a comma-separated string of model names.
func getModelNames(models []interface{}) string {
	var names []string
	for _, model := range models {
		names = append(names, reflect.TypeOf(model).Elem().Name())
	}
	return joinStrings(names, ", ")
}

// joinStrings joins a slice of strings with a separator.
func joinStrings(strings []string, separator string) string {
	result := ""
	for i, str := range strings {
		if i > 0 {
			result += separator
		}
		result += str
	}
	return result
}
