build:
    go build -o main .

run:
    go run main.go

clean:
    go clean
    rm -f main

docker-build:
    docker build -t hotel-compare .

docker-run:
    docker run -p 8080:8080 hotel-compare
