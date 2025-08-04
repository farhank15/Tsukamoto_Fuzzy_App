package academic

import (
	"encoding/json"
	"net/http"
	"strconv"
	"tsukamoto/internal/models"

	"github.com/gorilla/mux"
)

type academicHandler struct {
	repo AcademicRepository
}

func NewAcademicHandler(repo AcademicRepository) AcademicHandler {
	return &academicHandler{repo: repo}
}

func (h *academicHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateAcademicRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format"})
		return
	}

	// Validasi input
	if req.StudentID == 0 || req.UniversityID == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Student ID and University ID are required"})
		return
	}

	// Langsung assign tanpa konversi karena sudah sama-sama float32
	academic := models.Academic{
		UserID:            req.StudentID,
		UniversityID:      req.UniversityID,
		CoreCourseAverage: req.CoreCourseAverage,
		AttendanceRate:    req.AttendanceRate,
		FinalExamScore:    req.FinalExamScore,
		GPA:               req.GPA,
		MidtermExamScore:  req.MidtermExamScore,
	}

	if err := h.repo.Create(r.Context(), academic); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create academic record"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Academic record created successfully"})
}

func (h *academicHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid ID"})
		return
	}

	var req UpdateAcademicRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format"})
		return
	}

	// Langsung assign tanpa konversi karena sudah sama-sama float32
	academic := models.Academic{
		CoreCourseAverage: req.CoreCourseAverage,
		AttendanceRate:    req.AttendanceRate,
		FinalExamScore:    req.FinalExamScore,
		GPA:               req.GPA,
		MidtermExamScore:  req.MidtermExamScore,
	}

	if err := h.repo.Update(r.Context(), id, academic); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update academic record"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Academic record updated successfully"})
}

func (h *academicHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	academics, err := h.repo.GetAll(r.Context())
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to fetch academic records"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(academics)
}

func (h *academicHandler) GetByStudentID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	studentID, err := strconv.ParseUint(vars["student_id"], 10, 32)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid student ID"})
		return
	}

	academics, err := h.repo.GetByStudentID(r.Context(), uint(studentID))
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to fetch academic records"})
		return
	}

	// Jika tidak ada data, kembalikan array kosong dengan status 200
	if len(academics) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode([]models.Academic{})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(academics)
}

func (h *academicHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid ID"})
		return
	}

	academic, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to fetch academic record"})
		return
	}

	if academic == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Academic not found"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(academic)
}
