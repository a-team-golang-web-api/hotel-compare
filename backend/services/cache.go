package services

import (
    "context"
    "log"
    "time"

    "github.com/go-redis/redis/v8"
)

var redisClient *redis.Client

// InitCache initializes the Redis client
func InitCache(redisURL string) error {
    redisClient = redis.NewClient(&redis.Options{
        Addr: redisURL,
    })

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    _, err := redisClient.Ping(ctx).Result()
    if err != nil {
        log.Printf("Failed to connect to Redis: %v", err)
        return err
    }
    return nil
}

// CacheResponse caches a response in Redis with a given key and expiration time
func CacheResponse(ctx context.Context, key string, data []byte, expiration time.Duration) error {
    err := redisClient.Set(ctx, key, data, expiration).Err()
    if err != nil {
        log.Printf("Failed to cache response for key %s: %v", key, err)
    } else {
        log.Printf("Successfully cached response for key %s", key)
    }
    return err
}

// GetCachedResponse retrieves a cached response from Redis using a key
func GetCachedResponse(ctx context.Context, key string) ([]byte, error) {
    data, err := redisClient.Get(ctx, key).Bytes()
    if err != nil {
        if err == redis.Nil {
            log.Printf("Cache miss for key: %s", key)
            return nil, nil
        }
        log.Printf("Failed to retrieve cache for key %s: %v", key, err)
        return nil, err
    }
    log.Printf("Successfully retrieved cache for key %s", key)
    return data, nil
}
