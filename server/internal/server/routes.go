package server

import (
	"net/http"

	"tsukamoto/internal/domain/academic"
	"tsukamoto/internal/domain/auth"
	"tsukamoto/internal/domain/datasets"
	"tsukamoto/internal/domain/fuzzy"
	"tsukamoto/internal/domain/university"
	"tsukamoto/internal/domain/users"
	"tsukamoto/internal/middleware"
	"tsukamoto/internal/utils"

	"github.com/gorilla/mux"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := mux.NewRouter()

	// Health check route
	r.HandleFunc("/health", s.healthHandler)

	// datasets routes
	datasets.DatasetsRoute(r, s.db.GetDB())

	// fuzzy routes
	fuzzy.FuzzyRoute(r, s.db.GetDB())

	academic.AcademicRoute(r, s.db.GetDB())

	users.UserRoute(r, s.db.GetDB())

	auth.AuthRoute(r, s.db.GetDB())

	university.UniversityRoute(r, s.db.GetDB())

	// Wrap all routes with CORS middleware
	return middleware.CORSMiddleware(r)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	healthStatus := s.db.Health()
	utils.WriteResponse(w, http.StatusOK, nil, healthStatus)
}
