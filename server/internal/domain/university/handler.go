package university

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type universityHandler struct {
	repo UniversityRepository
}

func NewUniversityHandler(repo UniversityRepository) UniversityHandler {
	return &universityHandler{repo: repo}
}

func (h *universityHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	universities, err := h.repo.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(universities)
}

func (h *universityHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	university, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		if err.Error() == "university not found" {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(university)
}
