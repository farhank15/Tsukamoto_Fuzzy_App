package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost       string
	DBPort       string
	DBUser       string
	DBPassword   string
	DBName       string
	DBSchema     string
	AppPort      string
	JWTSecret    string
	JWTExpire    string
	JWTAlgorithm string
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return &Config{
		DBHost:       os.Getenv("BLUEPRINT_DB_HOST"),
		DBPort:       os.Getenv("BLUEPRINT_DB_PORT"),
		DBUser:       os.Getenv("BLUEPRINT_DB_USERNAME"),
		DBPassword:   os.Getenv("BLUEPRINT_DB_PASSWORD"),
		DBName:       os.Getenv("BLUEPRINT_DB_DATABASE"),
		DBSchema:     os.Getenv("BLUEPRINT_DB_SCHEMA"),
		AppPort:      os.Getenv("PORT"),
		JWTSecret:    os.Getenv("JWT_SECRET"),
		JWTExpire:    os.Getenv("JWT_EXPIRE"),
		JWTAlgorithm: os.Getenv("JWT_ALGORITHM"),
	}
}
