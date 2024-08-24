package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"hotel-compare/config"
	"hotel-compare/api"
	"hotel-compare/middleware"
	"hotel-compare/services"
)

func main() {
	// 環境設定の読み込み
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Ginのモード設定
	setGinMode()

	// ログファイル設定
	logFile, err := setupLogging()
	if err != nil {
		log.Fatalf("ログファイルの設定に失敗しました: %v", err)
	}
	defer closeLogFile(logFile)

	// Redis接続の初期化
	redisClient, err := services.InitializeRedis(cfg.RedisURL)
	if err != nil {
		log.Fatalf("Redis接続の初期化に失敗しました: %v", err)
	}
	defer closeRedisClient(redisClient)

	// ルーターのセットアップ
	router := setupRouter()

	// サーバー設定
	port := cfg.Port
	if port == "" {
		port = "8080" // デフォルトのポート
	}

	srv := &http.Server{
		Addr:           ":" + port,
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		IdleTimeout:    60 * time.Second,
		MaxHeaderBytes: 1 << 20, // 1MB
	}

	// サーバーの起動
	go func() {
		log.Printf("サーバーがポート %s で起動しました...", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("サーバー起動に失敗しました: %v", err)
		}
	}()

	// システム終了時のシグナルをキャッチして、適切にシャットダウン
	gracefulShutdown(srv)
}

// setGinMode sets the Gin mode based on the environment variable
func setGinMode() {
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		ginMode = gin.ReleaseMode // デフォルトはリリースモード
	}
	gin.SetMode(ginMode)
}

// setupLogging sets up the logging configuration
func setupLogging() (*os.File, error) {
	logFile, err := os.OpenFile("server.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		return nil, fmt.Errorf("ログファイルの作成に失敗しました: %w", err)
	}
	gin.DefaultWriter = logFile
	log.SetOutput(logFile)
	return logFile, nil
}

// closeLogFile closes the log file and logs any error
func closeLogFile(logFile *os.File) {
	if err := logFile.Close(); err != nil {
		log.Printf("ログファイルのクローズに失敗しました: %v", err)
	}
}

// closeRedisClient closes the Redis client and logs any error
func closeRedisClient(redisClient *redis.Client) {
	if err := redisClient.Close(); err != nil {
		log.Printf("Redisクライアントのクローズに失敗しました: %v", err)
	}
}

// setupRouter sets up the router and middleware
func setupRouter() *gin.Engine {
	router := gin.New()

	// Middleware settings
	router.Use(gin.Recovery()) // Panic recovery
	router.Use(gin.Logger())   // Standard logging middleware
	router.Use(middleware.CORS())
	router.Use(middleware.RateLimiter(100)) // Rate limiting to 100 requests/min

	// Set up the API routes
	api.SetupRoutes(router)

	return router
}

// gracefulShutdown handles graceful shutdown on system signals
func gracefulShutdown(srv *http.Server) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	sig := <-quit
	log.Printf("シグナル %s を受信しました。シャットダウンプロセスを開始します...", sig)

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("サーバーのシャットダウンに失敗しました: %v", err)
	}
	log.Println("サーバーが正常にシャットダウンしました")
}
