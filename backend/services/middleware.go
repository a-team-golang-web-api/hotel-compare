package middleware

import (
    "log"
    "net/http"
    "runtime/debug"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"  // UUID生成のためのライブラリ
)

// RecoveryMiddleware handles panics and other unexpected errors during request processing
func RecoveryMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        defer func() {
            if err := recover(); err != nil {
                // パニックが発生した場合、トラッキングIDを生成
                trackingID := uuid.New().String()
                log.Printf("Panic recovered [Tracking ID: %s]: %v\n%s", trackingID, err, debug.Stack())

                // クライアントにエラーメッセージとトラッキングIDを返す
                c.JSON(http.StatusInternalServerError, gin.H{
                    "error":       "Internal Server Error",
                    "tracking_id": trackingID,
                })
                c.Abort()
            }
        }()
        c.Next()
    }
}

// ErrorHandlerMiddleware captures any errors returned by handlers and processes them
func ErrorHandlerMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()

        if len(c.Errors) > 0 {
            // エラーが発生した場合、トラッキングIDを生成
            trackingID := uuid.New().String()
            errMsg := "An error occurred during processing your request."

            // デバッグモードの場合、エラーメッセージを詳細に返す
            if gin.IsDebugging() {
                errMsg = c.Errors.String()
            }

            log.Printf("Error [Tracking ID: %s]: %v", trackingID, c.Errors.String())

            // クライアントにエラーメッセージとトラッキングIDを返す
            c.JSON(http.StatusInternalServerError, gin.H{
                "error":       errMsg,
                "tracking_id": trackingID,
            })
        }
    }
}
