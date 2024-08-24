package config

import (
    "os"
)

type Config struct {
    RAKUTENAPIKey string
    Port          string
    RedisURL      string
}

func LoadConfig() *Config {
    return &Config{
        RAKUTENAPIKey: os.Getenv("RAKUTEN_API_KEY"),
        Port:          os.Getenv("PORT"),
        RedisURL:      os.Getenv("REDIS_URL"),
    }
}
