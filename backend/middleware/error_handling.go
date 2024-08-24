package middleware

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "log"
)

func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        defer func() {
            if r := recover(); r != nil {
                log.Printf("Recovered from panic: %v", r)
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
                c.Abort()
            }
        }()

        c.Next()

        if len(c.Errors) > 0 {
            log.Printf("Errors encountered: %v", c.Errors)
            c.JSON(http.StatusInternalServerError, gin.H{"error": c.Errors[0].Error()})
        }
    }
}
