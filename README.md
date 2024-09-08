# hotel-compare

条件を選択してホテル情報を安い順に表示するアプリケーション

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

## デザイン

https://www.figma.com/design/oWngunrWHFl07l3KjZKzUA/Untitled?node-id=3-1740&t=eMSkFbVnUlnNSgNf-0

# API使用方法

### ★Rakuten API

- **リクエスト**

| エンドポイント |
| ------- |
| api/rakuten |


| クエリパラメータ |  必須 or 任意 | 値 |  説明  |  例  |
| ------- | ------- | ------- | ------- | ------- |
| middleClassCode | 必須 | String | 中区分エリア指定。エリア情報.jsonに内容記載。 | hokkaido |
| smallClassCode | 必須 | String | 小区分エリア指定。エリア情報.jsonに内容記載 |  sapporo|
| detailClassCode | 下部の⚠注意参照 | String | 細区分エリア指定。エリア情報.jsonに内容記載 | A|
| adultNum | 必須 | Int | 人数 | 2|
| checkinDate | 必須 | String | チェックイン日。形式：yyyy-mm-dd |  2024-08-26|
| checkoutDate | 必須 | String | チェックアウト日。形式：yyyy-mm-dd | 2024-08-26|

**⚠注意:** 地域によってはdetailClassCodeは存在しない場合があります。存在する場合は必ず指定する必要があります。

<br>

- **レスポンス**

| レスポンス |  値 |  説明  |
| ------- |  ------- | ------- |
| hotelName |  String | ホテル名 |
| hotelInformationUrl | String | ホテルの紹介ページURL |
| hotelImageUrl |  String | ホテルの写真URL |
| roomName | String | 部屋の名前 |
| planName | String | プラン名 |
| reserveUrl | String | 予約ページのUrl |
| rakutenCharge | int | chargeFlagが0のとき：1人あたりの料金　chargeFlagが1のとき：1室あたりの料金 |
| total | int | 1泊の合計料金 |
| chargeFlag | int | 0：1人あたりの料金   1：1室あたりの料金 |
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

### ★smallClass取得API

| エンドポイント |
| ------- |
| api/small-class |

| クエリパラメータ |  必須 or 任意 | 値 |  説明  |  例  |
| ------- | ------- | ------- | ------- | ------- |
| middleClassName | 必須 | String | 都道府県名 | 東京都|

<br>

- **レスポンス**

| レスポンス |  値 |  説明  |
| ------- |  ------- | ------- |
| middleClassCode |  String | 中区分コード |
| smallClassCode | String | 小区分コード |
| smallClassName | String | 小区分名称 |

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


### ★detailClass取得API

| エンドポイント |
| ------- |
| api/detail-class |

| クエリパラメータ |  必須 or 任意 | 値 |  説明  |  例  |
| ------- | ------- | ------- | ------- | ------- |
| smallClassName | 必須 | String | 小区分名称 | 東京 |

<br>

- **レスポンス**

| レスポンス |  値 |  説明  |
| ------- |  ------- | ------- |
| detailClassCode |  String | 細区分コード |
| detailClassName | String | 細区分名称 |
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
