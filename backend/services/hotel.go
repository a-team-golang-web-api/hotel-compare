package api

import (
    "net/http"
    "time"
    "fmt"
    "hotel-compare/backend/services"
    "github.com/gin-gonic/gin"
)

// ValidateDateFormat checks if the provided date string matches the expected format (YYYY-MM-DD)
func ValidateDateFormat(date string) bool {
    _, err := time.Parse("2006-01-02", date)
    return err == nil
}

// DateIsBefore checks if the first date is before the second date
func DateIsBefore(date1, date2 string) bool {
    d1, _ := time.Parse("2006-01-02", date1)
    d2, _ := time.Parse("2006-01-02", date2)
    return d1.Before(d2)
}

func SearchHandler(c *gin.Context) {
    params := map[string]string{
        "destination": c.Query("destination"),
        "checkin":     c.Query("checkin"),
        "checkout":    c.Query("checkout"),
        "price_range": c.Query("price_range"),
        "filters":     c.Query("filters"),
    }

    var validationErrors []string

    if params["destination"] == "" {
        validationErrors = append(validationErrors, "Destination parameter is required.")
    }
    if params["checkin"] == "" {
        validationErrors = append(validationErrors, "Check-in date is required.")
    } else if !ValidateDateFormat(params["checkin"]) {
        validationErrors = append(validationErrors, "Check-in date format is invalid. Use YYYY-MM-DD.")
    }
    if params["checkout"] == "" {
        validationErrors = append(validationErrors, "Check-out date is required.")
    } else if !ValidateDateFormat(params["checkout"]) {
        validationErrors = append(validationErrors, "Check-out date format is invalid. Use YYYY-MM-DD.")
    }
    if params["checkin"] != "" && params["checkout"] != "" && !DateIsBefore(params["checkin"], params["checkout"]) {
        validationErrors = append(validationErrors, "Check-in date must be before check-out date.")
    }

    if len(validationErrors) > 0 {
        c.JSON(http.StatusBadRequest, gin.H{"errors": validationErrors})
        return
    }

    cacheKey := fmt.Sprintf("%s-%s-%s-%s-%s", params["destination"], params["checkin"], params["checkout"], params["price_range"], params["filters"])
    cachedResponse, err := services.GetCachedResponse(cacheKey)
    if err == nil && cachedResponse != nil {
        c.Data(http.StatusOK, "application/json", cachedResponse)
        return
    }

    hotels, err := services.SearchHotels(params)
    if err != nil {
        handleSearchError(c, err)
        return
    }

    responseData, err := json.Marshal(hotels)
    if err == nil {
        services.CacheResponse(cacheKey, responseData, 24*time.Hour)
    }

    c.JSON(http.StatusOK, gin.H{
        "hotels": hotels,
        "total":  len(hotels),
        "page":   1,
        "per_page": len(hotels), // For simplicity, returning all results in one page
    })
}

func handleSearchError(c *gin.Context, err error) {
    switch err {
    case services.ErrNoHotelsFound:
        c.JSON(http.StatusNotFound, gin.H{"error": "No hotels found for the specified criteria."})
    case services.ErrInvalidParameter:
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid search parameters."})
    case services.ErrAPITimeout:
        c.JSON(http.StatusServiceUnavailable, gin.H{"error": "The request timed out. Please try again later."})
    case services.ErrAPIRateLimitReached:
        c.JSON(http.StatusTooManyRequests, gin.H{"error": "API rate limit reached. Please try again later."})
    case services.ErrAPIServerError:
        c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Server error occurred. Please try again later."})
    case services.ErrAPINotFound:
        c.JSON(http.StatusNotFound, gin.H{"error": "API endpoint not found."})
    default:
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve hotel data."})
    }
}
