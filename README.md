# hotel-compare

ホテルの価格を比較するアプリケーション

## 環境構築

### frontend

#### 前提

Node.js v20 以上のインストール

#### 手順

```sh
$ cd frontend
$ npm install
$ npm run dev # 開発サーバー立ち上げ
```

### backend

#### 前提

Docker のインストール

#### 手順

```sh
$ cd backend
$ docker compose build --no-cache # ビルド
$ docker compose up # 開発環境立ち上げ
$ docker compose stop # コンテナ停止
```
