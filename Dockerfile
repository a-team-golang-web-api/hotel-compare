# ベースイメージ
FROM golang:1.20-alpine

# ワーキングディレクトリの設定
WORKDIR /app

# モジュールをコピーし、依存関係をインストール
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# ソースコードをコピー
COPY . .

# ビルド
RUN go build -o main .

# ポートを公開
EXPOSE 8080

# コンテナが起動したときに実行するコマンド
CMD ["./main"]
