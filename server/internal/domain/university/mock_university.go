package university

import (
	"context"
	"tsukamoto/internal/models"

	"github.com/stretchr/testify/mock"
)

type MockUniversityRepository struct {
	mock.Mock
}

func (m *MockUniversityRepository) GetAll(ctx context.Context) ([]models.University, error) {
	args := m.Called(ctx)
	return args.Get(0).([]models.University), args.Error(1)
}

func (m *MockUniversityRepository) GetByID(ctx context.Context, id int) (*models.University, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.University), args.Error(1)
}
