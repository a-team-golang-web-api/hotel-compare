package services

import (
    "context"
    "log"
    "time"

    "github.com/go-redis/redis/v8"
)

var redisClient *redis.Client

// InitializeRedisClient initializes the Redis client (this should be called during service startup)
func InitializeRedisClient(redisURL string) {
    redisClient = redis.NewClient(&redis.Options{
        Addr: redisURL,
    })

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    if err := redisClient.Ping(ctx).Err(); err != nil {
        log.Fatalf("Failed to connect to Redis: %v", err)
    }
}

func ClearOldCacheEntries(ctx context.Context) {
    ticker := time.NewTicker(24 * time.Hour)
    defer ticker.Stop()

    for {
        select {
        case <-ticker.C:
            keys, err := redisClient.Keys(ctx, "*").Result()
            if err != nil {
                log.Printf("Failed to retrieve keys from cache: %v", err)
                continue
            }

            for _, key := range keys {
                if err := redisClient.Del(ctx, key).Err(); err != nil {
                    log.Printf("Failed to delete cache key: %s | Error: %v", key, err)
                }
            }

        case <-ctx.Done():
            log.Println("Shutting down cache cleaner...")
            return
        }
    }
}
