# Hotel Compare API

This project is a simple hotel comparison API built with Go and Gin.

## Prerequisites

- Go 1.20+
- Docker (optional)
- Redis

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/hotel-compare.git
   ```
2. Set up your environment variables:
   ```sh
   cp .env.example .env
   ```
   Edit `.env` with your API keys.

3. Run the application:
   ```sh
   go run main.go
   ```

## Usage

You can query the API at `/api/hotels`.

## Docker

To build and run the application in a Docker container:

```sh
make docker-build
make docker-run
