package api

import (
    "log"
    "net/http"
    "hotel-compare/services"
    "github.com/gin-gonic/gin"
)

// HotelSearchParams defines the parameters used for hotel search
type HotelSearchParams struct {
    Destination string `json:"destination"`
    Checkin     string `json:"checkin"`
    Checkout    string `json:"checkout"`
    PriceRange  string `json:"price_range,omitempty"`
    Filters     string `json:"filters,omitempty"`
}

func SearchHandler(c *gin.Context) {
    params := HotelSearchParams{
        Destination: c.Query("destination"),
        Checkin:     c.Query("checkin"),
        Checkout:    c.Query("checkout"),
        PriceRange:  c.Query("price_range"),
        Filters:     c.Query("filters"),
    }

    // Check required parameters
    if params.Destination == "" || params.Checkin == "" || params.Checkout == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "The 'destination', 'checkin', and 'checkout' parameters are required."})
        return
    }

    // Save search history to session
    services.SaveSearchHistory(c, map[string]string{
        "destination": params.Destination,
        "checkin":     params.Checkin,
        "checkout":    params.Checkout,
        "price_range": params.PriceRange,
        "filters":     params.Filters,
    })

    // Execute hotel search in service layer
    hotels, err := services.SearchHotels(params)
    if err != nil {
        // Handle errors from the service layer
        log.Printf("SearchHotels error: %v", err) // Log the error
        switch err {
        case services.ErrNoHotelsFound:
            c.JSON(http.StatusNotFound, gin.H{"error": "No hotels found matching the specified criteria."})
        case services.ErrInvalidParameter:
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid search parameters provided."})
        case services.ErrAPITimeout:
            c.JSON(http.StatusServiceUnavailable, gin.H{"error": "The request timed out. Please try again later."})
        case services.ErrAPIRateLimitReached:
            c.JSON(http.StatusTooManyRequests, gin.H{"error": "Rate limit exceeded. Please try again later."})
        case services.ErrAPIServerError:
            c.JSON(http.StatusServiceUnavailable, gin.H{"error": "An error occurred on the server. Please try again later."})
        case services.ErrAPINotFound:
            c.JSON(http.StatusNotFound, gin.H{"error": "The requested API endpoint was not found."})
        default:
            c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occurred while retrieving hotel data."})
        }
        return
    }

    // Return the search results as JSON
    c.JSON(http.StatusOK, hotels)
}
