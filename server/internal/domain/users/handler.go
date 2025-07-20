package users

import (
	"encoding/json"
	"net/http"
	"strconv"
	"tsukamoto/internal/models"
	"tsukamoto/internal/utils"

	"github.com/gorilla/mux"
)

type userHandler struct {
	repo UserRepository
}

func NewUserHandler(repo UserRepository) UserHandler {
	return &userHandler{repo: repo}
}

func (h *userHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user := models.User{
		Username: req.Username,
		Name:     req.Name,
		Password: utils.HashPassword(req.Password),
		Role:     req.Role,
	}

	if err := h.repo.Create(r.Context(), user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *userHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user := models.User{
		Name: req.Name,
		Role: req.Role,
	}

	if req.Password != "" {
		user.Password = utils.HashPassword(req.Password)
	}

	if err := h.repo.Update(r.Context(), id, user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *userHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.repo.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *userHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	users, err := h.repo.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var response []UserResponse
	for _, user := range users {
		response = append(response, UserResponse{
			ID:       user.ID,
			Username: user.Username,
			Name:     user.Name,
			Role:     user.Role,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *userHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	user, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Name:     user.Name,
		Role:     user.Role,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
