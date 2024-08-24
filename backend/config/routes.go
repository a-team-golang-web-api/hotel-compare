package config

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"hotel-compare/services"
)

// SetupRouter sets up the Gin router with all the routes and handlers
func SetupRouter() *gin.Engine {
	router := gin.Default()

	// Middleware setup
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// API routes setup
	api := router.Group("/api")
	{
		api.GET("/hotels", searchHotelsHandler)
		api.GET("/health", healthCheckHandler)
	}

	return router
}

// searchHotelsHandler handles the /api/hotels GET request
func searchHotelsHandler(c *gin.Context) {
	// Extract query parameters
	destination := c.Query("destination")
	checkin := c.Query("checkin")
	checkout := c.Query("checkout")
	priceRange := c.Query("price_range")
	filters := c.Query("filters")

	// Validate the required parameters
	if destination == "" || checkin == "" || checkout == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "destination, checkin, and checkout parameters are required"})
		return
	}

	// Prepare search parameters
	params := map[string]string{
		"destination":  destination,
		"checkinDate":  checkin,
		"checkoutDate": checkout,
		"price_range":  priceRange,
		"filters":      filters,
	}

	// Search for hotels
	hotels, err := services.SearchHotels(params)
	if err != nil {
		handleSearchError(c, err)
		return
	}

	// Return the hotel search results
	c.JSON(http.StatusOK, hotels)
}

// handleSearchError processes the error returned from the hotel search service
func handleSearchError(c *gin.Context, err error) {
	switch err {
	case services.ErrNoHotelsFound:
		c.JSON(http.StatusNotFound, gin.H{"error": "No hotels found for the specified criteria"})
	case services.ErrInvalidParameter:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid search parameters"})
	case services.ErrAPITimeout:
		c.JSON(http.StatusGatewayTimeout, gin.H{"error": "API request timed out"})
	case services.ErrAPIRateLimitReached:
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "API rate limit reached"})
	case services.ErrAPIServerError:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API server error"})
	case services.ErrAPINotFound:
		c.JSON(http.StatusNotFound, gin.H{"error": "API endpoint not found"})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve hotel data"})
	}
}

// healthCheckHandler handles the /api/health GET request for health check
func healthCheckHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}
