# hotel-compare

条件を選択してホテル情報を安い順に表示するアプリケーション

## 環境構築

### frontend

#### 前提

Node.js v20 以上のインストール

#### 手順

##### ローカルで動作させる場合

1. 環境変数ファイルの作成

   - `frontend`ディレクトリ直下に`.env.local`を作成。`.env.example`の内容をコピペする。

2. ローカルで開発サーバ立ち上げ

   - 以下コマンドで`localhost:3000`にアクセスできれば成功

```sh
$ cd frontend
$ npm install
$ npm run dev # 開発サーバー立ち上げ
```

### backend

#### 前提

Docker のインストール

#### 手順

##### ローカルで動作させる場合

1. 環境変数ファイルの作成

   - `backend`ディレクトリ直下に`.env`を作成。`.env.example`の内容をコピペする。

2. ローカルで開発サーバ立ち上げ

   - 以下コマンドで`localhost:3000`にアクセスできれば成功
   - 楽天の API を利用するためにアプリケーション ID を取得する
     - [参考サイト](https://webservice.faq.rakuten.net/hc/ja/articles/900001970586-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3ID%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%A7%E3%81%99%E3%81%8B)

```sh
$ cd backend
$ docker compose build --no-cache # ビルド
$ docker compose up # 開発環境立ち上げ
$ docker compose stop # コンテナ停止
```

## デザイン

- [figma](https://www.figma.com/design/oWngunrWHFl07l3KjZKzUA/Untitled?node-id=3-1740&t=eMSkFbVnUlnNSgNf-0)

# API 使用方法

### ★Rakuten API

#### 概要

- クエリパラメータに基づいたホテル情報を取得する API。楽天 API のラッパー。

- **リクエスト**

| エンドポイント |
| -------------- |
| api/rakuten    |

| クエリパラメータ | 必須 or 任意      | 値     | 説明                                           | 例         |
| ---------------- | ----------------- | ------ | ---------------------------------------------- | ---------- |
| middleClassCode  | 必須              | String | 中区分エリア指定。エリア情報.json に内容記載。 | hokkaido   |
| smallClassCode   | 必須              | String | 小区分エリア指定。エリア情報.json に内容記載   | sapporo    |
| detailClassCode  | 下部の ⚠ 注意参照 | String | 細区分エリア指定。エリア情報.json に内容記載   | A          |
| adultNum         | 必須              | Int    | 人数                                           | 2          |
| checkinDate      | 必須              | String | チェックイン日。形式：yyyy-mm-dd               | 2024-08-26 |
| checkoutDate     | 必須              | String | チェックアウト日。形式：yyyy-mm-dd             | 2024-08-26 |

**⚠ 注意:** 地域によっては detailClassCode は存在しない場合があります。存在する場合は必ず指定する必要があります。

<br>

- **レスポンス**

| レスポンス          | 値     | 説明                                                                                |
| ------------------- | ------ | ----------------------------------------------------------------------------------- |
| hotelName           | String | ホテル名                                                                            |
| hotelInformationUrl | String | ホテルの紹介ページ URL                                                              |
| hotelImageUrl       | String | ホテルの写真 URL                                                                    |
| roomName            | String | 部屋の名前                                                                          |
| planName            | String | プラン名                                                                            |
| reserveUrl          | String | 予約ページの Url                                                                    |
| rakutenCharge       | int    | chargeFlag が 0 のとき：1 人あたりの料金　 chargeFlag が 1 のとき：1 室あたりの料金 |
| total               | int    | 1 泊の合計料金                                                                      |
| chargeFlag          | int    | 0：1 人あたりの料金 1：1 室あたりの料金                                             |

- **レスポンス例**

```
[
    {
        "hotelName": "ホテルグレイスリー札幌",
        "hotelInformationUrl": "https://img.travel.rakuten.co.jp/image/tr/api/re/pvonD/?f_no=635",
        "hotelImageUrl": "https://img.travel.rakuten.co.jp/share/HOTEL/635/635.jpg",
        "roomName": "■高層階エグゼクティブフロア■ツイン／喫煙・19平米",
        "planName": "★タイムセール：食事なし★【今だけ最大20％OFF】札幌駅徒歩1分＆地下街直結＋最大21時間ステイ",
        "reserveUrl": "https://img.travel.rakuten.co.jp/image/tr/api/re/IdsCY/?f_no=635&f_syu=12te&f_hi1=2024-08-24&f_hi2=2024-08-28&f_heya_su=1&f_otona_su=2&f_s1=0&f_s2=0&f_y1=0&f_y2=0&f_y3=0&f_y4=0&f_camp_id=5979611",
        "rakutenCharge": 11875,
        "total": 23750,
        "chargeFlag": 0
    }
 ]
```

### ★smallClass 取得 API

#### 概要

- 目的地の中項目を取得する API。この API レスポンスを使用して、ホテル情報を取得する。

| エンドポイント  |
| --------------- |
| api/small-class |

| クエリパラメータ | 必須 or 任意 | 値     | 説明       | 例     |
| ---------------- | ------------ | ------ | ---------- | ------ |
| middleClassName  | 必須         | String | 都道府県名 | 東京都 |

<br>

- **レスポンス**

| レスポンス      | 値     | 説明         |
| --------------- | ------ | ------------ |
| middleClassCode | String | 中区分コード |
| smallClassCode  | String | 小区分コード |
| smallClassName  | String | 小区分名称   |

- **レスポンス例**

```
[
    {
        "middleClassCode": "tokyo",
        "smallClassCode": "tokyo",
        "smallClassName": "東京２３区内"
    },
    {
        "middleClassCode": "tokyo",
        "smallClassCode": "nishi",
        "smallClassName": "立川・八王子・町田・府中・吉祥寺"
    }
]
```

### ★detailClass 取得 API

- 目的地の小項目を取得する API。この API レスポンスを使用して、ホテル情報を取得する。

| エンドポイント   |
| ---------------- |
| api/detail-class |

| クエリパラメータ | 必須 or 任意 | 値     | 説明       | 例   |
| ---------------- | ------------ | ------ | ---------- | ---- |
| smallClassName   | 必須         | String | 小区分名称 | 東京 |

<br>

- **レスポンス**

| レスポンス      | 値     | 説明         |
| --------------- | ------ | ------------ |
| detailClassCode | String | 細区分コード |
| detailClassName | String | 細区分名称   |

- **レスポンス例**

```
[
    {
        "detailClassCode": "A",
        "detailClassName": "東京駅・銀座・秋葉原・東陽町・葛西"
    },
    {
        "detailClassCode": "B",
        "detailClassName": "新橋・汐留・浜松町・お台場"
    }
]
```
