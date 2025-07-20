package utils

import (
	"encoding/json"
	"net/http"
)

// ErrorDetail represents a single error detail.
type ErrorDetail struct {
	Field   string `json:"field,omitempty"` // Field related to the error (optional)
	Message string `json:"message"`         // Error message
}

// Response represents a standard API response format.
type Response struct {
	Errors []ErrorDetail `json:"errors,omitempty"` // List of errors (if any)
	Data   interface{}   `json:"data"`             // Response data
}

// WriteResponse writes a formatted response to the client.
func WriteResponse(w http.ResponseWriter, statusCode int, errors []ErrorDetail, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := Response{
		Errors: errors,
		Data:   data,
	}

	json.NewEncoder(w).Encode(response)
}
