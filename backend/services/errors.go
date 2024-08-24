package services

import (
    "errors"
    "fmt"
)

var (
    ErrNoHotelsFound        = newServiceError("no hotels found", 404)
    ErrInvalidParameter     = newServiceError("invalid parameter", 400)
    ErrAPITimeout           = newServiceError("API timeout", 504)
    ErrAPIRateLimitReached  = newServiceError("API rate limit reached", 429)
    ErrAPIServerError       = newServiceError("API server error", 500)
    ErrAPINotFound          = newServiceError("API not found", 404)
)

type ServiceError struct {
    Message    string
    StatusCode int
}

func (e *ServiceError) Error() string {
    return fmt.Sprintf("%s (code: %d)", e.Message, e.StatusCode)
}

func newServiceError(message string, code int) *ServiceError {
    return &ServiceError{
        Message:    message,
        StatusCode: code,
    }
}
