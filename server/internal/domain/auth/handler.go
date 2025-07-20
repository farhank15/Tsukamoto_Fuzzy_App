package auth

import (
	"encoding/json"
	"net/http"
	"strings"
	"tsukamoto/internal/models"
	"tsukamoto/internal/utils"
)

type authHandler struct {
	repo AuthRepository
}

func NewAuthHandler(repo AuthRepository) AuthHandler {
	return &authHandler{repo: repo}
}

func (h *authHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{
			{Message: "Invalid request format"},
		}, nil)
		return
	}

	user, err := h.repo.GetUserByUsername(r.Context(), req.Username)
	if err != nil {
		utils.WriteResponse(w, http.StatusUnauthorized, []utils.ErrorDetail{
			{Message: "Invalid credentials"},
		}, nil)
		return
	}

	if !utils.CheckPassword(req.Password, user.Password) {
		utils.WriteResponse(w, http.StatusUnauthorized, []utils.ErrorDetail{
			{Message: "Invalid credentials"},
		}, nil)
		return
	}

	// Get academic info if exists
	academic, err := h.repo.GetUserAcademic(r.Context(), user.ID)
	var universityID int
	var universityName string
	if err == nil && academic.University.ID != 0 {
		universityID = int(academic.University.ID)
		universityName = academic.University.Name
	}

	token, err := utils.GenerateJWT(user.ID, user.Username, user.Role, universityID, universityName)
	if err != nil {
		utils.WriteResponse(w, http.StatusInternalServerError, []utils.ErrorDetail{
			{Message: "Error generating token"},
		}, nil)
		return
	}

	utils.WriteResponse(w, http.StatusOK, nil, LoginResponse{Token: token})
}

func (h *authHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{
			{Message: "Invalid request format"},
		}, nil)
		return
	}

	// Validate input
	if err := h.validateRegisterRequest(req); err != nil {
		utils.WriteResponse(w, http.StatusBadRequest, err, nil)
		return
	}

	// Check if username already exists
	existingUser, err := h.repo.GetUserByUsername(r.Context(), req.Username)
	if err == nil && existingUser != nil {
		utils.WriteResponse(w, http.StatusConflict, []utils.ErrorDetail{
			{Field: "username", Message: "Username already exists"},
		}, nil)
		return
	}

	// Handle university selection/creation
	var university *models.University
	if req.UniversityID != 0 {
		// Use existing university
		university, err = h.repo.GetUniversityByID(r.Context(), req.UniversityID)
		if err != nil {
			utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{
				{Field: "university_id", Message: "University not found"},
			}, nil)
			return
		}
	} else if req.UniversityName != "" && req.UniversityAddress != "" {
		// Create new university
		newUniversity := &models.University{
			Name:    req.UniversityName,
			Address: req.UniversityAddress,
		}
		university, err = h.repo.CreateUniversity(r.Context(), newUniversity)
		if err != nil {
			utils.WriteResponse(w, http.StatusInternalServerError, []utils.ErrorDetail{
				{Message: "Failed to create university"},
			}, nil)
			return
		}
	} else if req.Role == "student" {
		// University is required for students
		utils.WriteResponse(w, http.StatusBadRequest, []utils.ErrorDetail{
			{Message: "University information is required for students"},
		}, nil)
		return
	}

	// Create new user
	user := &models.User{
		Username: req.Username,
		Name:     req.Name,
		Password: utils.HashPassword(req.Password),
		Role:     req.Role,
	}

	createdUser, err := h.repo.CreateUser(r.Context(), user)
	if err != nil {
		utils.WriteResponse(w, http.StatusInternalServerError, []utils.ErrorDetail{
			{Message: "Failed to create user"},
		}, nil)
		return
	}

	// Create academic record for students
	if req.Role == "student" && university != nil {
		academic := &models.Academic{
			UserID:       uint(createdUser.ID),
			UniversityID: uint(university.ID),
		}
		_, err = h.repo.CreateAcademic(r.Context(), academic)
		if err != nil {
			utils.WriteResponse(w, http.StatusInternalServerError, []utils.ErrorDetail{
				{Message: "Failed to create academic record"},
			}, nil)
			return
		}
	}

	response := RegisterResponse{
		ID:       createdUser.ID,
		Username: createdUser.Username,
		Name:     createdUser.Name,
		Role:     createdUser.Role,
		Message:  "User registered successfully",
	}

	if university != nil {
		response.University = &UniversityResponse{
			ID:   university.ID,
			Name: university.Name,
		}
	}

	utils.WriteResponse(w, http.StatusCreated, nil, response)
}

func (h *authHandler) GetUniversities(w http.ResponseWriter, r *http.Request) {
	universities, err := h.repo.GetAllUniversities(r.Context())
	if err != nil {
		utils.WriteResponse(w, http.StatusInternalServerError, []utils.ErrorDetail{
			{Message: "Failed to get universities"},
		}, nil)
		return
	}

	var response []UniversityResponse
	for _, uni := range universities {
		response = append(response, UniversityResponse{
			ID:   uni.ID,
			Name: uni.Name,
		})
	}

	utils.WriteResponse(w, http.StatusOK, nil, response)
}

func (h *authHandler) validateRegisterRequest(req RegisterRequest) []utils.ErrorDetail {
	var errors []utils.ErrorDetail

	// Validate username
	if strings.TrimSpace(req.Username) == "" {
		errors = append(errors, utils.ErrorDetail{
			Field:   "username",
			Message: "Username is required",
		})
	} else if len(req.Username) < 3 || len(req.Username) > 50 {
		errors = append(errors, utils.ErrorDetail{
			Field:   "username",
			Message: "Username must be between 3 and 50 characters",
		})
	}

	// Validate name
	if strings.TrimSpace(req.Name) == "" {
		errors = append(errors, utils.ErrorDetail{
			Field:   "name",
			Message: "Name is required",
		})
	} else if len(req.Name) < 2 || len(req.Name) > 50 {
		errors = append(errors, utils.ErrorDetail{
			Field:   "name",
			Message: "Name must be between 2 and 50 characters",
		})
	}

	// Validate password
	if strings.TrimSpace(req.Password) == "" {
		errors = append(errors, utils.ErrorDetail{
			Field:   "password",
			Message: "Password is required",
		})
	} else if len(req.Password) < 6 {
		errors = append(errors, utils.ErrorDetail{
			Field:   "password",
			Message: "Password must be at least 6 characters",
		})
	}

	// Validate role
	if strings.TrimSpace(req.Role) == "" {
		errors = append(errors, utils.ErrorDetail{
			Field:   "role",
			Message: "Role is required",
		})
	} else if req.Role != "admin" && req.Role != "student" {
		errors = append(errors, utils.ErrorDetail{
			Field:   "role",
			Message: "Role must be either 'admin' or 'student'",
		})
	}

	// Validate university for students
	if req.Role == "student" {
		if req.UniversityID == 0 && (req.UniversityName == "" || req.UniversityAddress == "") {
			errors = append(errors, utils.ErrorDetail{
				Field:   "university",
				Message: "Students must select an existing university or provide university name and address to create a new one",
			})
		}

		if req.UniversityID != 0 && (req.UniversityName != "" || req.UniversityAddress != "") {
			errors = append(errors, utils.ErrorDetail{
				Field:   "university",
				Message: "Please either select an existing university or provide details for a new one, not both",
			})
		}

		if req.UniversityName != "" && len(req.UniversityName) > 100 {
			errors = append(errors, utils.ErrorDetail{
				Field:   "university_name",
				Message: "University name must not exceed 100 characters",
			})
		}

		if req.UniversityAddress != "" && len(req.UniversityAddress) > 255 {
			errors = append(errors, utils.ErrorDetail{
				Field:   "university_address",
				Message: "University address must not exceed 255 characters",
			})
		}
	}

	return errors
}
