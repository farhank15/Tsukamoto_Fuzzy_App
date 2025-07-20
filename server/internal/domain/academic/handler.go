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
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validasi input
	if req.StudentID == 0 || req.UniversityID == 0 {
		http.Error(w, "Student ID and University ID are required", http.StatusBadRequest)
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
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Academic record created successfully"})
}

func (h *academicHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req UpdateAcademicRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
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
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Academic record updated successfully"})
}

func (h *academicHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	academics, err := h.repo.GetAll(r.Context())
	if err != nil {
		// FIX: Typo yang diperbaiki - StatusInternalServerError bukan StatusInternalServerServer
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(academics)
}

func (h *academicHandler) GetByStudentID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	studentID, err := strconv.ParseUint(vars["student_id"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid student ID", http.StatusBadRequest)
		return
	}

	academics, err := h.repo.GetByStudentID(r.Context(), uint(studentID))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Jika tidak ada data, kembalikan array kosong dengan status 200
	if len(academics) == 0 {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]models.Academic{})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(academics)
}

func (h *academicHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	academic, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if academic == nil {
		http.Error(w, "Academic not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(academic)
}
