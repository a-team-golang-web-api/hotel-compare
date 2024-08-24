package services

import (
    "net/http"
    "sync"
    "time"
    "fmt"
    "errors"
    "encoding/json"
    "io"
    "hotel-compare/config"
)

// Define custom errors
var (
    ErrRequestFailed    = errors.New("request failed")
    ErrNoValidResponses = errors.New("no valid responses received")
)

// Hotel represents a hotel structure with basic information
type Hotel struct {
    Name  string `json:"name"`
    Image string `json:"image"`
    Price int    `json:"price"`
}

// AsyncRequest represents an asynchronous HTTP request
type AsyncRequest struct {
    URL      string
    Response *http.Response
    Error    error
}

// SendAsyncRequests sends multiple HTTP requests concurrently and waits for all responses
func SendAsyncRequests(urls []string) ([]*http.Response, []error) {
    var wg sync.WaitGroup
    wg.Add(len(urls))

    results := make([]*http.Response, len(urls))
    errors := make([]error, len(urls))

    client := &http.Client{Timeout: 10 * time.Second}

    for i, url := range urls {
        go func(i int, url string) {
            defer wg.Done()
            resp, err := client.Get(url)
            results[i] = resp
            if err != nil {
                errors[i] = fmt.Errorf("%w: %s", ErrRequestFailed, err.Error())
                return
            }
            if resp.StatusCode != http.StatusOK {
                errors[i] = fmt.Errorf("non-200 status code: %d", resp.StatusCode)
            }
        }(i, url)
    }

    wg.Wait()

    return results, errors
}

// SearchHotels searches for hotels using multiple asynchronous requests
func SearchHotels(params map[string]string) ([]Hotel, error) {
    cfg := config.LoadConfig()
    apiKey := cfg.RAKUTENAPIKey

    // Prepare multiple request URLs for different APIs or endpoints
    urls := []string{
        fmt.Sprintf("https://app.rakuten.co.jp/services/api/Travel/KeywordHotelSearch/20170426?keyword=%s&checkinDate=%s&checkoutDate=%s&applicationId=%s", params["destination"], params["checkin"], params["checkout"], apiKey),
        fmt.Sprintf("https://api.anotherexample.com/hotels?destination=%s&checkin=%s&checkout=%s&apiKey=%s", params["destination"], params["checkin"], params["checkout"], apiKey),
    }

    // Send requests asynchronously
    responses, errs := SendAsyncRequests(urls)

    var hotels []Hotel

    // Handle responses and errors
    for i, resp := range responses {
        if errs[i] != nil {
            continue // Skip failed requests
        }

        body, err := io.ReadAll(resp.Body)
        resp.Body.Close() // Close the body after reading
        if err != nil {
            continue // Skip if unable to read the response body
        }

        var response struct {
            Hotels []Hotel `json:"hotels"`
        }
        if err := json.Unmarshal(body, &response); err != nil {
            continue // Skip if JSON decoding fails
        }

        hotels = append(hotels, response.Hotels...)
    }

    if len(hotels) == 0 {
        return nil, ErrNoValidResponses
    }

    return hotels, nil
}
