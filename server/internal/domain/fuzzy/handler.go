package fuzzy

import (
	"net/http"
	"strconv"

	"tsukamoto/internal/models"
	"tsukamoto/internal/modules/deffuzifikasi"
	"tsukamoto/internal/modules/fuzzifikasi"
	"tsukamoto/internal/modules/inferensi"
	"tsukamoto/internal/utils"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// Handler struct holds dependencies for fuzzy handlers
type Handler struct {
	DB *gorm.DB
}

// NewHandler creates a new Handler
func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

// FuzzyByUserID handles GET /fuzzy/:id
func (h *Handler) FuzzyByUserID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	userID, err := strconv.Atoi(idStr)
	if err != nil {
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{{Message: "ID user tidak valid"}}, nil)
		return
	}

	var academic models.Academic
	if err := h.DB.Where("user_id = ?", userID).First(&academic).Error; err != nil {
		utils.WriteResponse(w, http.StatusNotFound, []utils.ErrorDetail{{Message: "User tidak ditemukan"}}, nil)
		return
	}

	// Ambil input yang diperlukan untuk aturan fuzzy
	gpa := float64(academic.GPA)
	cca := float64(academic.CoreCourseAverage)
	attendance := float64(academic.AttendanceRate)
	midterm := float64(academic.MidtermExamScore)
	finalExam := float64(academic.FinalExamScore)

	// Validasi input
	if attendance < 0 || attendance > 1 {
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{{Message: "Nilai attendance tidak valid"}}, nil)
		return
	}
	if midterm < 0 || midterm > 100 {
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{{Message: "Nilai midterm exam tidak valid"}}, nil)
		return
	}
	if finalExam < 0 || finalExam > 100 {
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{{Message: "Nilai final exam tidak valid"}}, nil)
		return
	}
	if gpa < 0 || gpa > 4 {
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{{Message: "Nilai GPA tidak valid"}}, nil)
		return
	}
	if cca < 0 || cca > 100 {
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{{Message: "Nilai CCA tidak valid"}}, nil)
		return
	}

	// Fuzzifikasi
	gpaLow, gpaMed, gpaHigh := fuzzifikasi.FuzzifyGPA(gpa)
	ccaLow, ccaMed, ccaHigh := fuzzifikasi.FuzzifyCCA(cca)
	attLow, attMed, attHigh := fuzzifikasi.FuzzifyAttendance(attendance)
	midLow, midMed, midHigh := fuzzifikasi.FuzzifyMES(midterm)
	finLow, finMed, finHigh := fuzzifikasi.FuzzifyFinalExam(finalExam)

	// Inferensi
	output := inferensi.Inference(gpa, cca, attendance, midterm, finalExam)

	// Defuzzifikasi
	category, err := deffuzifikasi.Defuzzify(output)
	if err != nil {
		utils.WriteResponse(w, http.StatusInternalServerError, []utils.ErrorDetail{{Message: err.Error()}}, nil)
		return
	}

	// Defuzzifikasi numerik (average)
	// Mapping kategori ke nilai numerik representative
	categoryValues := map[string]float64{
		"Poor":              1,
		"Needs Improvement": 2,
		"Satisfactory":      3,
		"Good":              4,
		"Excellent":         5,
	}
	var sum float64
	var total float64
	for cat, val := range categoryValues {
		membership := output[cat]
		sum += membership * val
		total += membership
	}
	var defuzzValue float64
	if total > 0 {
		defuzzValue = sum / total
	} else {
		defuzzValue = 0
	}

	utils.WriteResponse(w, http.StatusOK, nil, map[string]interface{}{
		"user_id":               userID,
		"category":              category,
		"defuzzification_value": defuzzValue,
		"inputs": map[string]interface{}{
			"gpa":        gpa,
			"cca":        cca,
			"attendance": attendance,
			"midterm":    midterm,
			"final_exam": finalExam,
		},
		"fuzzy_membership": map[string]interface{}{
			"gpa": map[string]float64{
				"low":    gpaLow,
				"medium": gpaMed,
				"high":   gpaHigh,
			},
			"cca": map[string]float64{
				"low":    ccaLow,
				"medium": ccaMed,
				"high":   ccaHigh,
			},
			"attendance": map[string]float64{
				"low":    attLow,
				"medium": attMed,
				"high":   attHigh,
			},
			"midterm": map[string]float64{
				"low":    midLow,
				"medium": midMed,
				"high":   midHigh,
			},
			"final_exam": map[string]float64{
				"low":    finLow,
				"medium": finMed,
				"high":   finHigh,
			},
		},
		"inference_output": output,
	})
}
