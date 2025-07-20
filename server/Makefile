# Simple Makefile for a Go project

# Build the application
all: build test

build:
	@echo "Building..."
	
	
	@go build -o main cmd/api/main.go

# Run the application
run:
	@go run cmd/api/main.go
# Create DB container
docker-run:
	@if docker compose up --build 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose up --build; \
	fi

# Shutdown DB container
docker-down:
	@if docker compose down 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose down; \
	fi

# Test the application
test:
	@echo "Testing..."
	@go test ./... -v
# Integrations Tests for the application
itest:
	@echo "Running integration tests..."
	@go test ./internal/database -v

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -f main

# Live Reload
watch:
	@if command -v air > /dev/null; then \
            air; \
            echo "Watching...";\
        else \
            read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
            if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
                go install github.com/air-verse/air@latest; \
                air; \
                echo "Watching...";\
            else \
                echo "You chose not to install air. Exiting..."; \
                exit 1; \
            fi; \
        fi

# Run database migrations
migrate:
	@echo "Running migrations..."
	@go run cmd/migrate/main.go

# Run fresh migrations (drop and recreate tables)
fresh-migrate:
	@echo "Running fresh migrations..."
	@go run cmd/fresh_migrate/main.go

# Generate mocks for interfaces
mockgen:
	@echo "Generating mocks..."
	@mockgen -source=internal/domain/auth/interface.go -destination=internal/domain/auth/mock_auth.go -package=auth
	@mockgen -source=internal/domain/academic/interface.go -destination=internal/domain/academic/mock_academic.go -package=academic
	@mockgen -source=internal/domain/datasets/interface.go -destination=internal/domain/datasets/mock_datasets.go -package=datasets
	@mockgen -source=internal/domain/users/interface.go -destination=internal/domain/users/mock_users.go -package=users

# Show test coverage in HTML
cover:
	@echo "Generating coverage report..."
	@go test ./... -coverprofile=coverage.out
	@go tool cover -html=coverage.out

.PHONY: all build run test clean watch docker-run docker-down itest migrate fresh-migrate cover mockgen test-datasets test-users
