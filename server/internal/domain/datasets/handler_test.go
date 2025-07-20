package datasets

import (
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"tsukamoto/internal/models"

	"github.com/golang/mock/gomock"
)

const (
	importPath = "/datasets/import"
	getAllPath = "/datasets"
)

func TestAcademicHandler_ImportCSV_BadRequest(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAcademicRepository(ctrl)
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("POST", importPath, bytes.NewReader([]byte("invalid")))
	w := httptest.NewRecorder()

	handler.ImportCSV(w, req)
	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

func TestAcademicHandler_GetAll_Success(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAcademicRepository(ctrl)
	handler := NewAcademicHandler(mockRepo)

	mockRepo.EXPECT().
		GetAll(gomock.Any()).
		Return([]models.Academic{}, nil)

	req := httptest.NewRequest("GET", getAllPath, nil)
	w := httptest.NewRecorder()

	handler.GetAll(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestAcademicHandler_GetAll_Error(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAcademicRepository(ctrl)
	handler := NewAcademicHandler(mockRepo)

	mockRepo.EXPECT().
		GetAll(gomock.Any()).
		Return(nil, errors.New("db error"))

	req := httptest.NewRequest("GET", getAllPath, nil)
	w := httptest.NewRecorder()

	handler.GetAll(w, req)
	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", w.Code)
	}
}
