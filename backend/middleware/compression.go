package middleware

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/gzip"
    "log"
)

func CompressionMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        defer func() {
            if r := recover(); r != nil {
                log.Printf("Recovered from panic in compression middleware: %v", r)
                c.AbortWithStatus(500)
            }
        }()
        gzip.Gzip(gzip.BestCompression)(c)
    }
}
