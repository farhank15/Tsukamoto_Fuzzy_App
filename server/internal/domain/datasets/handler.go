package datasets

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"tsukamoto/internal/models"

	"github.com/gocarina/gocsv"
)

// academicHandler implements AcademicHandler interface
type academicHandler struct {
	repo AcademicRepository
}

// NewAcademicHandler creates a new instance of academicHandler
func NewAcademicHandler(repo AcademicRepository) AcademicHandler {
	return &academicHandler{repo: repo}
}

// ImportCSV handles CSV file import from a JSON request body with file path
func (h *academicHandler) ImportCSV(w http.ResponseWriter, r *http.Request) {
	// Parse JSON request body
	var requestBody struct {
		FilePath string `json:"file_path"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Gagal parsing JSON body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate file path
	if requestBody.FilePath == "" {
		http.Error(w, "File path diperlukan", http.StatusBadRequest)
		return
	}
	if !filepath.IsAbs(requestBody.FilePath) || filepath.Ext(requestBody.FilePath) != ".csv" {
		http.Error(w, "File path tidak valid: harus absolut dan berakhir dengan .csv", http.StatusBadRequest)
		return
	}

	// Open CSV file
	file, err := os.Open(requestBody.FilePath)
	if err != nil {
		http.Error(w, "Gagal membuka file CSV: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read CSV file
	reader := csv.NewReader(file)
	reader.FieldsPerRecord = -1 // Allow variable number of fields
	var dtos []AcademicDTO
	if err := gocsv.UnmarshalCSV(reader, &dtos); err != nil {
		http.Error(w, "Gagal parsing file CSV: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate and convert DTOs to models
	var academics []models.Academic
	for _, dto := range dtos {
		// Validate DTO fields
		if dto.StudentID == 0 || dto.GPA <= 0 || dto.AttendanceRate < 0 || dto.AttendanceRate > 1 {
			http.Error(w, fmt.Sprintf("Data tidak valid untuk StudentID %d", dto.StudentID), http.StatusBadRequest)
			return
		}

		academics = append(academics, dto.ToModel(dto.StudentID)) // Gunakan uint, bukan float32
	}

	// Import ke database
	if err := h.repo.ImportCSV(r.Context(), academics); err != nil {
		http.Error(w, "Gagal mengimpor data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Kirim respons JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "CSV berhasil diimpor",
		"count":   len(academics),
	})
}

// GetAll handles retrieving all academic records
func (h *academicHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	academics, err := h.repo.GetAll(r.Context())
	if err != nil {
		http.Error(w, "Gagal mengambil data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Konversi model ke DTO untuk respons
	var dtos []AcademicDTO
	for _, academic := range academics {
		dtos = append(dtos, AcademicDTO{
			StudentID:         academic.UserID,
			UniversityID:      academic.UniversityID,
			GPA:               academic.GPA,
			CoreCourseAverage: academic.CoreCourseAverage,
			AttendanceRate:    academic.AttendanceRate,
			FinalExamScore:    academic.FinalExamScore,
			MidtermExamScore:  academic.MidtermExamScore,
		})
	}

	// Kirim respons JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(dtos)
}
