package users

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"tsukamoto/internal/models"

	"github.com/golang/mock/gomock"
	"github.com/gorilla/mux"
)

const (
	usersPath    = "/users"
	usersPathID  = "/users/1"
)

func TestUserHandler_Create_Success(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockUserRepository(ctrl)
	handler := NewUserHandler(mockRepo)

	mockRepo.EXPECT().
		Create(gomock.Any(), gomock.Any()).
		Return(nil)

	reqBody := CreateUserRequest{
		Username: "user1",
		Name:     "User One",
		Password: "pass",
		Role:     "student",
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", usersPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Create(w, req)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d", w.Code)
	}
}

func TestUserHandler_Create_BadRequest(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockUserRepository(ctrl)
	handler := NewUserHandler(mockRepo)

	req := httptest.NewRequest("POST", usersPath, bytes.NewReader([]byte("invalid")))
	w := httptest.NewRecorder()

	handler.Create(w, req)
	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

func TestUserHandler_Create_InternalError(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockUserRepository(ctrl)
	handler := NewUserHandler(mockRepo)

	mockRepo.EXPECT().
		Create(gomock.Any(), gomock.Any()).
		Return(errors.New("db error"))

	reqBody := CreateUserRequest{
		Username: "user1",
		Name:     "User One",
		Password: "pass",
		Role:     "student",
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", usersPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Create(w, req)
	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", w.Code)
	}
}

func TestUserHandler_GetAll_Success(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockUserRepository(ctrl)
	handler := NewUserHandler(mockRepo)

	mockRepo.EXPECT().
		GetAll(gomock.Any()).
		Return([]models.User{{ID: 1, Username: "user1", Name: "User One", Role: "student"}}, nil)

	req := httptest.NewRequest("GET", usersPath, nil)
	w := httptest.NewRecorder()

	handler.GetAll(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestUserHandler_GetAll_Error(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockUserRepository(ctrl)
	handler := NewUserHandler(mockRepo)

	mockRepo.EXPECT().
		GetAll(gomock.Any()).
		Return(nil, errors.New("db error"))

	req := httptest.NewRequest("GET", usersPath, nil)
	w := httptest.NewRecorder()

	handler.GetAll(w, req)
	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", w.Code)
	}
}

func TestUserHandler_GetByID_Success(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockUserRepository(ctrl)
	handler := NewUserHandler(mockRepo)

	mockRepo.EXPECT().
		GetByID(gomock.Any(), 1).
		Return(&models.User{ID: 1, Username: "user1", Name: "User One", Role: "student"}, nil)

	req := httptest.NewRequest("GET", usersPathID, nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	w := httptest.NewRecorder()

	handler.GetByID(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestUserHandler_GetByID_BadID(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockUserRepository(ctrl)
	handler := NewUserHandler(mockRepo)

	req := httptest.NewRequest("GET", "/users/abc", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "abc"})
	w := httptest.NewRecorder()

	handler.GetByID(w, req)
	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

func TestUserHandler_GetByID_Error(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockUserRepository(ctrl)
	handler := NewUserHandler(mockRepo)

	mockRepo.EXPECT().
		GetByID(gomock.Any(), 1).
		Return(nil, errors.New("db error"))

	req := httptest.NewRequest("GET", usersPathID, nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	w := httptest.NewRecorder()

	handler.GetByID(w, req)
	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", w.Code)
	}
}
