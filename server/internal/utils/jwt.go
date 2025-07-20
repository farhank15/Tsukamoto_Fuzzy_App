package utils

import (
	"time"

	"tsukamoto/config"

	"github.com/golang-jwt/jwt/v4"
)

type JWTUtil struct {
	secret    string
	expire    time.Duration
	algorithm string
}

// NewJWTUtil creates a new instance of JWTUtil with the given configuration.
func NewJWTUtil(cfg *config.Config) *JWTUtil {
	expireDuration, err := time.ParseDuration(cfg.JWTExpire)
	if err != nil {
		expireDuration = 24 * time.Hour // Default to 24 hours if parsing fails
	}

	return &JWTUtil{
		secret:    cfg.JWTSecret,
		expire:    expireDuration,
		algorithm: cfg.JWTAlgorithm,
	}
}

type Claims struct {
	ID   int    `json:"user_id"`
	Name string `json:"name"`
	Nim  string `json:"nim"`
	Role string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateJWT generates a new JWT token for a user.
func (j *JWTUtil) GenerateJWT(id int, name, nim, role string) (string, error) {
	claims := &Claims{
		ID:   id,
		Name: name,
		Nim:  nim,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(j.expire)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.GetSigningMethod(j.algorithm), claims)
	return token.SignedString([]byte(j.secret))
}

// ValidateJWT validates a JWT token and returns the claims if valid.
func (j *JWTUtil) ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(j.secret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, jwt.ErrSignatureInvalid
	}

	return claims, nil
}

var jwtKey = []byte("your-secret-key") // In production, use env variable

// GenerateJWT generates a new JWT token using the default HS256 method.
func GenerateJWT(userID int, username string, role string, universityID int, universityName string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["user_id"] = userID
	claims["username"] = username
	claims["role"] = role
	claims["university_id"] = universityID
	claims["university_name"] = universityName
	claims["exp"] = time.Now().Add(24 * time.Hour).Unix()

	return token.SignedString(jwtKey)
}

// ValidateToken parses and validates the JWT token using the default HS256 method.
func ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
}
