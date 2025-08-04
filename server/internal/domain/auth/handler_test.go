package auth

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"tsukamoto/internal/models"
	"tsukamoto/internal/utils"

	"github.com/golang/mock/gomock"
	"golang.org/x/crypto/bcrypt"
)

const loginPath = "/auth/login"
const registerPath = "/auth/register"

func bcryptHash(password string) string {
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash)
}

// Helper function to parse response
func parseResponse(w *httptest.ResponseRecorder) utils.Response {
	var resp utils.Response
	json.NewDecoder(w.Body).Decode(&resp)
	return resp
}

// LOGIN TESTS
func TestAuthHandler_Login_Success(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	// password yang akan diinput user
	rawPassword := "mypassword"
	// hash bcrypt yang disimpan di database
	hashedPassword := bcryptHash(rawPassword)

	user := &models.User{ID: 1, Username: "user", Password: hashedPassword, Role: "student"}
	academic := &models.Academic{University: models.University{ID: 2, Name: "Univ"}}

	mockRepo.EXPECT().
		GetUserByUsername(gomock.Any(), "user").
		Return(user, nil)
	mockRepo.EXPECT().
		GetUserAcademic(gomock.Any(), 1).
		Return(academic, nil)

	reqBody := LoginRequest{Username: "user", Password: rawPassword}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", loginPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Login(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors != nil {
		t.Errorf("expected no errors, got %v", resp.Errors)
	}

	// Check if data contains token
	if resp.Data == nil {
		t.Errorf("expected data, got nil")
	}

	// Parse the data as LoginResponse
	dataBytes, _ := json.Marshal(resp.Data)
	var loginResp LoginResponse
	json.Unmarshal(dataBytes, &loginResp)

	if loginResp.Token == "" {
		t.Errorf("expected token, got empty")
	}
}

func TestAuthHandler_Login_BadRequest(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	req := httptest.NewRequest("POST", loginPath, bytes.NewReader([]byte("invalid")))
	w := httptest.NewRecorder()

	handler.Login(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors == nil || len(resp.Errors) == 0 {
		t.Errorf("expected errors, got none")
	}

	if resp.Data != nil {
		t.Errorf("expected no data, got %v", resp.Data)
	}
}

func TestAuthHandler_Login_UserNotFound(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	mockRepo.EXPECT().
		GetUserByUsername(gomock.Any(), "user").
		Return(nil, errors.New("not found"))

	reqBody := LoginRequest{Username: "user", Password: "pass"}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", loginPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Login(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors == nil || len(resp.Errors) == 0 {
		t.Errorf("expected errors, got none")
	}

	if resp.Errors[0].Message != "Invalid credentials" {
		t.Errorf("expected 'Invalid credentials', got %s", resp.Errors[0].Message)
	}
}

func TestAuthHandler_Login_WrongPassword(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	// Simpan hash dari password yang benar
	hashedPassword := bcryptHash("mypassword")
	user := &models.User{ID: 1, Username: "user", Password: hashedPassword, Role: "student"}
	mockRepo.EXPECT().
		GetUserByUsername(gomock.Any(), "user").
		Return(user, nil)

	// Kirim password yang salah
	reqBody := LoginRequest{Username: "user", Password: "wrongpassword"}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", loginPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Login(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors == nil || len(resp.Errors) == 0 {
		t.Errorf("expected errors, got none")
	}

	if resp.Errors[0].Message != "Invalid credentials" {
		t.Errorf("expected 'Invalid credentials', got %s", resp.Errors[0].Message)
	}
}

// REGISTER TESTS
func TestAuthHandler_Register_Success(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	// Mock university
	university := &models.University{ID: 1, Name: "Test University"}

	// Mock user not found (username available)
	mockRepo.EXPECT().
		GetUserByUsername(gomock.Any(), "newuser").
		Return(nil, errors.New("not found"))

	// Mock get university by ID - FIXED: expecting int instead of uint
	mockRepo.EXPECT().
		GetUniversityByID(gomock.Any(), 1).
		Return(university, nil)

	// Mock successful user creation
	expectedUser := &models.User{
		ID:       1,
		Username: "newuser",
		Name:     "New User",
		Role:     "student",
	}
	mockRepo.EXPECT().
		CreateUser(gomock.Any(), gomock.Any()).
		Return(expectedUser, nil)

	// Mock academic record creation
	mockRepo.EXPECT().
		CreateAcademic(gomock.Any(), gomock.Any()).
		Return(&models.Academic{}, nil)

	reqBody := RegisterRequest{
		Username:     "newuser",
		Name:         "New User",
		Password:     "password123",
		Role:         "student",
		UniversityID: 1, // Added university ID for student
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", registerPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Register(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors != nil {
		t.Errorf("expected no errors, got %v", resp.Errors)
	}

	if resp.Data == nil {
		t.Errorf("expected data, got nil")
	}

	// Parse the data as RegisterResponse
	dataBytes, _ := json.Marshal(resp.Data)
	var registerResp RegisterResponse
	json.Unmarshal(dataBytes, &registerResp)

	if registerResp.Username != "newuser" {
		t.Errorf("expected username 'newuser', got %s", registerResp.Username)
	}

	if registerResp.Message != "User registered successfully" {
		t.Errorf("expected success message, got %s", registerResp.Message)
	}
}

func TestAuthHandler_Register_Success_Admin(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	// Mock user not found (username available)
	mockRepo.EXPECT().
		GetUserByUsername(gomock.Any(), "adminuser").
		Return(nil, errors.New("not found"))

	// Mock successful user creation
	expectedUser := &models.User{
		ID:       1,
		Username: "adminuser",
		Name:     "Admin User",
		Role:     "admin",
	}
	mockRepo.EXPECT().
		CreateUser(gomock.Any(), gomock.Any()).
		Return(expectedUser, nil)

	reqBody := RegisterRequest{
		Username: "adminuser",
		Name:     "Admin User",
		Password: "password123",
		Role:     "admin",
		// No university required for admin
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", registerPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Register(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors != nil {
		t.Errorf("expected no errors, got %v", resp.Errors)
	}

	if resp.Data == nil {
		t.Errorf("expected data, got nil")
	}
}

func TestAuthHandler_Register_BadRequest(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	req := httptest.NewRequest("POST", registerPath, bytes.NewReader([]byte("invalid")))
	w := httptest.NewRecorder()

	handler.Register(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors == nil || len(resp.Errors) == 0 {
		t.Errorf("expected errors, got none")
	}
}

func TestAuthHandler_Register_ValidationErrors(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	// Test with invalid data
	reqBody := RegisterRequest{
		Username: "ab",      // too short
		Name:     "",        // empty
		Password: "123",     // too short
		Role:     "invalid", // invalid role
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", registerPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Register(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors == nil || len(resp.Errors) == 0 {
		t.Errorf("expected validation errors, got none")
	}

	// Should have multiple validation errors
	if len(resp.Errors) < 4 {
		t.Errorf("expected at least 4 validation errors, got %d", len(resp.Errors))
	}
}

func TestAuthHandler_Register_UsernameExists(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	// Hapus mockRepo.EXPECT().GetUniversityByID karena tidak dipanggil sebelum username check

	// Mock user found (username already exists) - this is the main check
	existingUser := &models.User{ID: 1, Username: "existinguser"}
	mockRepo.EXPECT().
		GetUserByUsername(gomock.Any(), "existinguser").
		Return(existingUser, nil)

	reqBody := RegisterRequest{
		Username:     "existinguser",
		Name:         "New User",
		Password:     "password123",
		Role:         "student",
		UniversityID: 1, // Added university ID for student
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", registerPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Register(w, req)

	if w.Code != http.StatusConflict {
		t.Errorf("expected 409, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors == nil || len(resp.Errors) == 0 {
		t.Errorf("expected errors, got none")
	}

	if resp.Errors[0].Field != "username" {
		t.Errorf("expected field 'username', got %s", resp.Errors[0].Field)
	}

	if resp.Errors[0].Message != "Username already exists" {
		t.Errorf("expected 'Username already exists', got %s", resp.Errors[0].Message)
	}
}

func TestAuthHandler_Register_DatabaseError(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	// Mock university
	university := &models.University{ID: 1, Name: "Test University"}

	// Mock user not found (username available)
	mockRepo.EXPECT().
		GetUserByUsername(gomock.Any(), "newuser").
		Return(nil, errors.New("not found"))

	// Mock get university by ID - FIXED: expecting int instead of uint
	mockRepo.EXPECT().
		GetUniversityByID(gomock.Any(), 1).
		Return(university, nil)

	// Mock database error during user creation
	mockRepo.EXPECT().
		CreateUser(gomock.Any(), gomock.Any()).
		Return(nil, errors.New("database error"))

	reqBody := RegisterRequest{
		Username:     "newuser",
		Name:         "New User",
		Password:     "password123",
		Role:         "student",
		UniversityID: 1, // Added university ID for student
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", registerPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Register(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors == nil || len(resp.Errors) == 0 {
		t.Errorf("expected errors, got none")
	}

	if resp.Errors[0].Message != "Failed to create user" {
		t.Errorf("expected 'Failed to create user', got %s", resp.Errors[0].Message)
	}
}

// Test for creating new university
func TestAuthHandler_Register_CreateNewUniversity(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := NewMockAuthRepository(ctrl)
	handler := NewAuthHandler(mockRepo)

	// Mock new university creation
	newUniversity := &models.University{ID: 2, Name: "New University", Address: "New Address"}

	// Mock user not found (username available)
	mockRepo.EXPECT().
		GetUserByUsername(gomock.Any(), "studentuser").
		Return(nil, errors.New("not found"))

	// Mock create university
	mockRepo.EXPECT().
		CreateUniversity(gomock.Any(), gomock.Any()).
		Return(newUniversity, nil)

	// Mock successful user creation
	expectedUser := &models.User{
		ID:       1,
		Username: "studentuser",
		Name:     "Student User",
		Role:     "student",
	}
	mockRepo.EXPECT().
		CreateUser(gomock.Any(), gomock.Any()).
		Return(expectedUser, nil)

	// Mock academic record creation
	mockRepo.EXPECT().
		CreateAcademic(gomock.Any(), gomock.Any()).
		Return(&models.Academic{}, nil)

	reqBody := RegisterRequest{
		Username:          "studentuser",
		Name:              "Student User",
		Password:          "password123",
		Role:              "student",
		UniversityName:    "New University",
		UniversityAddress: "New Address",
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", registerPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Register(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d", w.Code)
	}

	resp := parseResponse(w)
	if resp.Errors != nil {
		t.Errorf("expected no errors, got %v", resp.Errors)
	}

	if resp.Data == nil {
		t.Errorf("expected data, got nil")
	}
}
