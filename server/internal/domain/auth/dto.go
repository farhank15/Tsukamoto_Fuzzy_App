package auth

// Request structs
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Username          string `json:"username"`
	Name              string `json:"name"`
	Password          string `json:"password"`
	Role              string `json:"role"`
	UniversityID      int    `json:"university_id,omitempty"`      // For selecting existing university
	UniversityName    string `json:"university_name,omitempty"`    // For creating new university
	UniversityAddress string `json:"university_address,omitempty"` // For creating new university
}

// Response structs
type LoginResponse struct {
	Token string `json:"token"`
}

type RegisterResponse struct {
	ID         int                 `json:"id"`
	Username   string              `json:"username"`
	Name       string              `json:"name"`
	Role       string              `json:"role"`
	University *UniversityResponse `json:"university,omitempty"`
	Message    string              `json:"message"`
}

type UniversityResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
