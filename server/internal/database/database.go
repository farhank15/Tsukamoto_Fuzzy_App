package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Service interface {
	Health() map[string]string
	Close() error
	GetDB() *gorm.DB
}

type service struct {
	db *gorm.DB
}

var (
	database   = os.Getenv("BLUEPRINT_DB_DATABASE")
	password   = os.Getenv("BLUEPRINT_DB_PASSWORD")
	username   = os.Getenv("BLUEPRINT_DB_USERNAME")
	port       = os.Getenv("BLUEPRINT_DB_PORT")
	host       = os.Getenv("BLUEPRINT_DB_HOST")
	schema     = os.Getenv("BLUEPRINT_DB_SCHEMA")
	dbInstance *service
)

func New() Service {
	if dbInstance != nil {
		return dbInstance
	}

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable search_path=%s", host, port, username, password, database, schema)

	// Konfigurasi logger GORM
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second, // Log query yang lebih lama dari 1 detik
			LogLevel:      logger.Warn, // Hanya log warning dan error
			Colorful:      true,
		},
	)

	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		log.Fatal(err)
	}

	dbInstance = &service{db: db}
	return dbInstance
}

func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Ping database menggunakan sql.DB yang underlying dari gorm.DB
	sqlDB, err := s.db.DB()
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("cannot get sql.DB: %v", err)
		log.Fatalf("cannot get sql.DB: %v", err)
		return stats
	}

	err = sqlDB.PingContext(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		log.Fatalf("db down: %v", err)
		return stats
	}

	// Database is up
	stats["status"] = "up"
	stats["message"] = "It's healthy"

	// Get database stats
	dbStats := sqlDB.Stats()
	stats["open_connections"] = fmt.Sprintf("%d", dbStats.OpenConnections)
	stats["in_use"] = fmt.Sprintf("%d", dbStats.InUse)
	stats["idle"] = fmt.Sprintf("%d", dbStats.Idle)
	stats["wait_count"] = fmt.Sprintf("%d", dbStats.WaitCount)
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = fmt.Sprintf("%d", dbStats.MaxIdleClosed)
	stats["max_lifetime_closed"] = fmt.Sprintf("%d", dbStats.MaxLifetimeClosed)

	// Evaluate stats
	if dbStats.OpenConnections > 40 {
		stats["message"] = "The database is experiencing heavy load."
	}
	if dbStats.WaitCount > 1000 {
		stats["message"] = "The database has a high number of wait events, indicating potential bottlenecks."
	}
	if dbStats.MaxIdleClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many idle connections are being closed, consider revising the connection pool settings."
	}
	if dbStats.MaxLifetimeClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many connections are being closed due to max lifetime, consider increasing max lifetime."
	}

	return stats
}

func (s *service) GetDB() *gorm.DB {
	return s.db
}

func (s *service) Close() error {
	log.Printf("Disconnected from database: %s", database)
	sqlDB, err := s.db.DB()
	if err != nil {
		return fmt.Errorf("cannot get sql.DB: %v", err)
	}
	return sqlDB.Close()
}
