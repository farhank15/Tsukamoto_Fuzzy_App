package academic

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"tsukamoto/internal/models"

	"github.com/gorilla/mux"
)

const (
	academicPath      = "/academic"
	academicPathID    = "/academic/1"
	academicStudentID = "/academic/student/1"
	dbErrorMsg        = "db error"
)

func assertEqual(t *testing.T, a, b interface{}, msg string) {
	if a != b {
		t.Errorf("%s: got %v, want %v", msg, a, b)
	}
}

func assertJSONResponse(t *testing.T, w *httptest.ResponseRecorder, expectedStatus int, expectedBody interface{}) {
	if w.Code != expectedStatus {
		t.Errorf("Expected status %d, got %d", expectedStatus, w.Code)
	}

	if expectedBody != nil {
		var actualBody interface{}
		err := json.NewDecoder(w.Body).Decode(&actualBody)
		if err != nil {
			t.Fatalf("Failed to decode response body: %v", err)
		}

		expectedJSON, _ := json.Marshal(expectedBody)
		actualJSON, _ := json.Marshal(actualBody)
		if string(expectedJSON) != string(actualJSON) {
			t.Errorf("Expected body %s, got %s", expectedJSON, actualJSON)
		}
	}
}

type mockAcademicRepo struct {
	CreateFn         func(ctx context.Context, academic models.Academic) error
	UpdateFn         func(ctx context.Context, id int, academic models.Academic) error
	GetAllFn         func(ctx context.Context) ([]models.Academic, error)
	GetByStudentIDFn func(ctx context.Context, studentID uint) ([]models.Academic, error)
	GetByIDFn        func(ctx context.Context, id int) (*models.Academic, error)
}

func (m *mockAcademicRepo) Create(ctx context.Context, academic models.Academic) error {
	return m.CreateFn(ctx, academic)
}
func (m *mockAcademicRepo) Update(ctx context.Context, id int, academic models.Academic) error {
	return m.UpdateFn(ctx, id, academic)
}
func (m *mockAcademicRepo) GetAll(ctx context.Context) ([]models.Academic, error) {
	return m.GetAllFn(ctx)
}
func (m *mockAcademicRepo) GetByStudentID(ctx context.Context, studentID uint) ([]models.Academic, error) {
	return m.GetByStudentIDFn(ctx, studentID)
}
func (m *mockAcademicRepo) GetByID(ctx context.Context, id int) (*models.Academic, error) {
	return m.GetByIDFn(ctx, id)
}

func TestAcademicHandlerCreate(t *testing.T) {
	tests := []struct {
		name         string
		reqBody      interface{}
		mockCreateFn func(context.Context, models.Academic) error
		expectedCode int
		expectedBody interface{}
	}{
		{
			name: "success",
			reqBody: CreateAcademicRequest{
				StudentID:         1,
				UniversityID:      2,
				CoreCourseAverage: 80,
				AttendanceRate:    90,
				FinalExamScore:    85,
				GPA:               3.5,
				MidtermExamScore:  75,
			},
			mockCreateFn: func(ctx context.Context, a models.Academic) error {
				return nil
			},
			expectedCode: http.StatusCreated,
			expectedBody: map[string]string{"message": "Academic record created successfully"},
		},
		{
			name: "missing required fields",
			reqBody: CreateAcademicRequest{
				CoreCourseAverage: 80,
				AttendanceRate:    90,
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: map[string]string{"error": "Student ID and University ID are required"},
		},
		{
			name:         "invalid json",
			reqBody:      "invalid json",
			expectedCode: http.StatusBadRequest,
		},
		{
			name: "database error",
			reqBody: CreateAcademicRequest{
				StudentID:         1,
				UniversityID:      2,
				CoreCourseAverage: 80,
			},
			mockCreateFn: func(ctx context.Context, a models.Academic) error {
				return errors.New(dbErrorMsg)
			},
			expectedCode: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := &mockAcademicRepo{CreateFn: tt.mockCreateFn}
			handler := NewAcademicHandler(mockRepo)

			var body []byte
			if s, ok := tt.reqBody.(string); ok {
				body = []byte(s)
			} else {
				body, _ = json.Marshal(tt.reqBody)
			}

			req := httptest.NewRequest("POST", academicPath, bytes.NewReader(body))
			w := httptest.NewRecorder()

			handler.Create(w, req)
			assertJSONResponse(t, w, tt.expectedCode, tt.expectedBody)
		})
	}
}

func TestAcademicHandlerCreateBadRequest(t *testing.T) {
	mockRepo := &mockAcademicRepo{}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("POST", academicPath, bytes.NewReader([]byte("invalid json")))
	w := httptest.NewRecorder()

	handler.Create(w, req)
	assertEqual(t, http.StatusBadRequest, w.Code, "Create bad request status")
}

func TestAcademicHandlerCreateInternalError(t *testing.T) {
	mockRepo := &mockAcademicRepo{
		CreateFn: func(ctx context.Context, academic models.Academic) error {
			return errors.New(dbErrorMsg)
		},
	}
	handler := NewAcademicHandler(mockRepo)

	reqBody := CreateAcademicRequest{
		StudentID:         1,
		UniversityID:      2,
		CoreCourseAverage: 80,
		AttendanceRate:    90,
		FinalExamScore:    85,
		GPA:               3.5,
		MidtermExamScore:  75,
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("POST", academicPath, bytes.NewReader(body))
	w := httptest.NewRecorder()

	handler.Create(w, req)
	assertEqual(t, http.StatusInternalServerError, w.Code, "Create internal error status")
}

func TestAcademicHandlerUpdate(t *testing.T) {
	mockRepo := &mockAcademicRepo{
		UpdateFn: func(ctx context.Context, id int, academic models.Academic) error {
			return nil
		},
	}
	handler := NewAcademicHandler(mockRepo)

	reqBody := UpdateAcademicRequest{
		CoreCourseAverage: 80,
		AttendanceRate:    90,
		FinalExamScore:    85,
		GPA:               3.5,
		MidtermExamScore:  75,
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("PUT", academicPathID, bytes.NewReader(body))
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	w := httptest.NewRecorder()

	handler.Update(w, req)
	assertEqual(t, http.StatusOK, w.Code, "Update status")
}

func TestAcademicHandlerUpdateBadID(t *testing.T) {
	mockRepo := &mockAcademicRepo{}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("PUT", "/academic/abc", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "abc"})
	w := httptest.NewRecorder()

	handler.Update(w, req)
	assertEqual(t, http.StatusBadRequest, w.Code, "Update bad id status")
}

func TestAcademicHandlerUpdateBadRequest(t *testing.T) {
	mockRepo := &mockAcademicRepo{}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("PUT", academicPathID, bytes.NewReader([]byte("invalid json")))
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	w := httptest.NewRecorder()

	handler.Update(w, req)
	assertEqual(t, http.StatusBadRequest, w.Code, "Update bad request status")
}

func TestAcademicHandlerUpdateInternalError(t *testing.T) {
	mockRepo := &mockAcademicRepo{
		UpdateFn: func(ctx context.Context, id int, academic models.Academic) error {
			return errors.New(dbErrorMsg)
		},
	}
	handler := NewAcademicHandler(mockRepo)

	reqBody := UpdateAcademicRequest{
		CoreCourseAverage: 80,
		AttendanceRate:    90,
		FinalExamScore:    85,
		GPA:               3.5,
		MidtermExamScore:  75,
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest("PUT", academicPathID, bytes.NewReader(body))
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	w := httptest.NewRecorder()

	handler.Update(w, req)
	assertEqual(t, http.StatusInternalServerError, w.Code, "Update internal error status")
}

func TestAcademicHandlerGetAll(t *testing.T) {
	mockRepo := &mockAcademicRepo{
		GetAllFn: func(ctx context.Context) ([]models.Academic, error) {
			return []models.Academic{{ID: 1}}, nil
		},
	}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("GET", academicPath, nil)
	w := httptest.NewRecorder()

	handler.GetAll(w, req)
	assertEqual(t, http.StatusOK, w.Code, "GetAll status")
	assertEqual(t, "application/json", w.Header().Get("Content-Type"), "GetAll content-type")
}

func TestAcademicHandlerGetAllInternalError(t *testing.T) {
	mockRepo := &mockAcademicRepo{
		GetAllFn: func(ctx context.Context) ([]models.Academic, error) {
			return nil, errors.New(dbErrorMsg)
		},
	}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("GET", academicPath, nil)
	w := httptest.NewRecorder()

	handler.GetAll(w, req)
	assertEqual(t, http.StatusInternalServerError, w.Code, "GetAll internal error status")
}

func TestAcademicHandlerGetByStudentID(t *testing.T) {
	mockRepo := &mockAcademicRepo{
		GetByStudentIDFn: func(ctx context.Context, studentID uint) ([]models.Academic, error) {
			return []models.Academic{{ID: 1, UserID: studentID}}, nil
		},
	}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("GET", academicStudentID, nil)
	req = mux.SetURLVars(req, map[string]string{"student_id": "1"})
	w := httptest.NewRecorder()

	handler.GetByStudentID(w, req)
	assertEqual(t, http.StatusOK, w.Code, "GetByStudentID status")
	assertEqual(t, "application/json", w.Header().Get("Content-Type"), "GetByStudentID content-type")
}

func TestAcademicHandlerGetByStudentIDBadID(t *testing.T) {
	mockRepo := &mockAcademicRepo{}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("GET", "/academic/student/abc", nil)
	req = mux.SetURLVars(req, map[string]string{"student_id": "abc"})
	w := httptest.NewRecorder()

	handler.GetByStudentID(w, req)
	assertEqual(t, http.StatusBadRequest, w.Code, "GetByStudentID bad id status")
}

func TestAcademicHandlerGetByStudentIDInternalError(t *testing.T) {
	mockRepo := &mockAcademicRepo{
		GetByStudentIDFn: func(ctx context.Context, studentID uint) ([]models.Academic, error) {
			return nil, errors.New(dbErrorMsg)
		},
	}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("GET", academicStudentID, nil)
	req = mux.SetURLVars(req, map[string]string{"student_id": "1"})
	w := httptest.NewRecorder()

	handler.GetByStudentID(w, req)
	assertEqual(t, http.StatusInternalServerError, w.Code, "GetByStudentID internal error status")
}

func TestAcademicHandlerGetByID(t *testing.T) {
	mockRepo := &mockAcademicRepo{
		GetByIDFn: func(ctx context.Context, id int) (*models.Academic, error) {
			return &models.Academic{ID: 1, UserID: 1}, nil
		},
	}
	handler := NewAcademicHandler(mockRepo)

	req := httptest.NewRequest("GET", academicPathID, nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	w := httptest.NewRecorder()

	handler.GetByID(w, req)
	assertJSONResponse(t, w, http.StatusOK, &models.Academic{ID: 1, UserID: 1})
}
