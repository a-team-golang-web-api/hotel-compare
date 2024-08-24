package middleware

import (
    "github.com/gin-gonic/gin"
    "log"
    "time"
)

func RequestLogger() gin.HandlerFunc {
    return func(c *gin.Context) {
        startTime := time.Now()
        c.Next()
        duration := time.Since(startTime)

        log.Printf("Request: %s %s | Status: %d | Duration: %v",
            c.Request.Method,
            c.Request.URL.Path,
            c.Writer.Status(),
            duration,
        )

        if len(c.Errors) > 0 {
            log.Printf("Request Errors: %v", c.Errors)
        }
    }
}
