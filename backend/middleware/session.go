package middleware

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/sessions"
    "github.com/gin-contrib/sessions/cookie"
    "log"
)

func SessionMiddleware() gin.HandlerFunc {
    store := cookie.NewStore([]byte("secret"))
    return sessions.Sessions("hotel_session", store)
}

func GetSessionData(c *gin.Context, key string) (interface{}, error) {
    session := sessions.Default(c)
    value := session.Get(key)
    if value == nil {
        log.Printf("Session data not found for key: %s", key)
        return nil, nil
    }
    return value, nil
}

func SetSessionData(c *gin.Context, key string, value interface{}) error {
    session := sessions.Default(c)
    session.Set(key, value)
    err := session.Save()
    if err != nil {
        log.Printf("Failed to save session data: %v", err)
    }
    return err
}
