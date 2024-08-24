package services

import (
    "github.com/gin-contrib/sessions"
    "github.com/gin-gonic/gin"
    "log"
)

// SaveSearchHistory saves the search parameters to the session
func SaveSearchHistory(c *gin.Context, searchParams map[string]string) {
    session := sessions.Default(c)
    
    // 既存の検索履歴を取得し、型アサーションを行う
    var history []map[string]string
    if h := session.Get("search_history"); h != nil {
        if hist, ok := h.([]map[string]string); ok {
            history = hist
        } else {
            log.Printf("Search history is of unexpected type: %T", h)
            history = []map[string]string{}
        }
    }

    // 新しい検索履歴を追加し、上限を設定（例: 最新10件）
    history = append(history, searchParams)
    if len(history) > 10 {
        history = history[len(history)-10:]
    }

    // セッションに保存
    session.Set("search_history", history)
    err := session.Save()
    if err != nil {
        log.Printf("Failed to save search history: %v", err)
        c.JSON(500, gin.H{"error": "Failed to save search history"})
    }
}

// GetSearchHistory retrieves the search history from the session
func GetSearchHistory(c *gin.Context) []map[string]string {
    session := sessions.Default(c)
    
    // 検索履歴を取得し、型アサーションを行う
    if history := session.Get("search_history"); history != nil {
        if hist, ok := history.([]map[string]string); ok {
            return hist
        }
        log.Printf("Search history is of unexpected type: %T", history)
    }
    return []map[string]string{}
}

// ClearSearchHistory clears the search history from the session
func ClearSearchHistory(c *gin.Context) {
    session := sessions.Default(c)
    session.Delete("search_history")
    err := session.Save()
    if err != nil {
        log.Printf("Failed to clear search history: %v", err)
        c.JSON(500, gin.H{"error": "Failed to clear search history"})
    } else {
        c.JSON(200, gin.H{"message": "Search history cleared successfully"})
    }
}
