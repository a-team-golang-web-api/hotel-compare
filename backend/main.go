package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"io"
	"io/ioutil"
	"encoding/json"
	"github.com/joho/godotenv"
	"github.com/a-team-golang-web-api/hotel-compare/config"
	
	"golang.org/x/sync/errgroup"
)
// 楽天APIの構造体
type RakutenResponse struct {
	PagingInfo struct {
		RecordCount int `json:"recordCount"`
		PageCount   int `json:"pageCount"`
		Page        int `json:"page"`
		First       int `json:"first"`
		Last        int `json:"last"`
	} `json:"pagingInfo"`
	Hotels []struct {
		Hotel []struct {
			HotelBasicInfo struct {
				HotelNo             int     `json:"hotelNo"`
				HotelName           string  `json:"hotelName"`
				HotelInformationURL string  `json:"hotelInformationUrl"`
				PlanListURL         string  `json:"planListUrl"`
				DpPlanListURL       string  `json:"dpPlanListUrl"`
				ReviewURL           string  `json:"reviewUrl"`
				HotelKanaName       string  `json:"hotelKanaName"`
				HotelSpecial        string  `json:"hotelSpecial"`
				HotelMinCharge      int     `json:"hotelMinCharge"`
				Latitude            float64 `json:"latitude"`
				Longitude           float64 `json:"longitude"`
				PostalCode          string  `json:"postalCode"`
				Address1            string  `json:"address1"`
				Address2            string  `json:"address2"`
				TelephoneNo         string  `json:"telephoneNo"`
				FaxNo               string  `json:"faxNo"`
				Access              string  `json:"access"`
				ParkingInformation  string  `json:"parkingInformation"`
				NearestStation      string  `json:"nearestStation"`
				HotelImageURL       string  `json:"hotelImageUrl"`
				HotelThumbnailURL   string  `json:"hotelThumbnailUrl"`
				RoomImageURL        string  `json:"roomImageUrl"`
				RoomThumbnailURL    string  `json:"roomThumbnailUrl"`
				HotelMapImageURL    string  `json:"hotelMapImageUrl"`
				ReviewCount         int     `json:"reviewCount"`
				ReviewAverage       float64 `json:"reviewAverage"`
				UserReview          string  `json:"userReview"`
			} `json:"hotelBasicInfo,omitempty"`
			RoomInfo []struct {
				RoomBasicInfo struct {
					RoomClass           string `json:"roomClass"`
					RoomName            string `json:"roomName"`
					PlanID              int    `json:"planId"`
					PlanName            string `json:"planName"`
					PointRate           int    `json:"pointRate"`
					WithDinnerFlag      int    `json:"withDinnerFlag"`
					DinnerSelectFlag    int    `json:"dinnerSelectFlag"`
					WithBreakfastFlag   int    `json:"withBreakfastFlag"`
					BreakfastSelectFlag int    `json:"breakfastSelectFlag"`
					Payment             string `json:"payment"`
					ReserveURL          string `json:"reserveUrl"`
					SalesformFlag       int    `json:"salesformFlag"`
				} `json:"roomBasicInfo,omitempty"`
				DailyCharge struct {
					StayDate      string `json:"stayDate"`
					RakutenCharge int    `json:"rakutenCharge"`
					Total         int    `json:"total"`
					ChargeFlag    int    `json:"chargeFlag"`
				} `json:"dailyCharge,omitempty"`
			} `json:"roomInfo,omitempty"`
		} `json:"hotel"`
	} `json:"hotels"`
}

// 返すホテル情報をまとめた構造体
type HotelAndRoomInfo struct {
	HotelName string `json:"hotelName"`
	HotelInformationURL string  `json:"hotelInformationUrl"`
	HotelImageURL       string  `json:"hotelImageUrl"`
	RoomName            string `json:"roomName"`
	PlanName            string `json:"planName"`
	ReserveURL          string `json:"reserveUrl"`
	RakutenCharge int    `json:"rakutenCharge"`
	Total         int    `json:"total"`	
	ChargeFlag int `json:"chargeFlag"`
}



// 返すsmallClassCodeとsmallClassNameの情報をまとめた構造体
type SmallClass struct {
	MiddleClassCode string `json:"middleClassCode"`
	SmallClassCode string `json:"smallClassCode"`
	SmallClassName string  `json:"smallClassName"`
}

// 返すdetailClassCodeとdetailClassNameの情報をまとめた構造体
type DetailClass struct {
	DetailClassCode string `json:"detailClassCode"`
	DetailClassName string  `json:"detailClassName"`
}

func main() {
	if len(os.Args) != 2 {
		log.Printf("need port number\n")
		os.Exit(1)
	}
	p := os.Args[1]
	l, err := net.Listen("tcp", ":"+p)
	if err != nil {
		log.Fatalf("failed to listen port %s: %v", p, err)
	}
	url := fmt.Sprintf("http://%s", l.Addr().String())
	log.Printf("start with: %v", url)
	fmt.Printf("start with: %v", url)
	if err := run(context.Background(), l); err != nil {
		log.Printf("failed to terminated server: %v", err)
		os.Exit(1)
	}
}

func run(ctx context.Context, l net.Listener) error {
	// s := &http.Server{
	// 	Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 		fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
	// 	}),
	// }

	mux := http.NewServeMux() 
	s := &http.Server{
		Handler: mux,
	}
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
    })
	mux.HandleFunc("/api/rakuten", rakutenSearchHandler)
	mux.HandleFunc("/api/small-class", smallClassSearchHandler)
	mux.HandleFunc("/api/detail-class", detailClassSearchHandler)


	eg, ctx := errgroup.WithContext(ctx)
	eg.Go(func() error {
		if err := s.Serve(l); err != nil &&
			err != http.ErrServerClosed {
			log.Printf("failed to close: %+v", err)
			return err
		}
		return nil
	})

	<-ctx.Done()
	if err := s.Shutdown(context.Background()); err != nil {
		log.Printf("failed to shutdown: %+v", err)
	}
	// グレースフルシャットダウンの終了を待つ。
	return eg.Wait()
}


func rakutenSearchHandler(w http.ResponseWriter, r *http.Request) {

    // .env ファイルを読み込み
    if err := godotenv.Load(); err != nil {
        log.Fatalf("Error loading .env file")
    }
    applicationId := os.Getenv("applicationId")

    // クエリパラメータを解析する
    query := r.URL.Query()
	largeClassCode := "japan"
	middleClassCode := query.Get("middleClassCode")
	smallClassCode := query.Get("smallClassCode")
	detailClassCode := query.Get("detailClassCode")
	checkinDate := query.Get("checkinDate")
	checkoutDate := query.Get("checkoutDate")
	adultNum := query.Get("adultNum")

	baseURL := config.BaseURL
    queryParams := url.Values{}
    queryParams.Add("largeClassCode", largeClassCode)
    queryParams.Add("middleClassCode", middleClassCode)
    queryParams.Add("smallClassCode", smallClassCode)
    queryParams.Add("detailClassCode", detailClassCode)
	queryParams.Add("applicationId", applicationId)
    queryParams.Add("checkinDate", checkinDate)
    queryParams.Add("checkoutDate", checkoutDate)
    queryParams.Add("adultNum", adultNum)
    
	// URLにパラメータをエンコードして追加
    fullURL := fmt.Sprintf("%s?%s", baseURL, queryParams.Encode())

	// リクエスト失敗時
	response, err := http.Get(fullURL)
	if err != nil {
		log.Fatal("エラー発生: ", err)
	}

	// body読み込み失敗時
	body, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	// Response構造体の変数を作成
    var rakutenResponse RakutenResponse

    // JSON文字列をResponse構造体にデコード
    err = json.Unmarshal(body, &rakutenResponse)
    if err != nil {
        fmt.Println("Error unmarshaling JSON:", err)
        return
    }

	cheapestRooms := getCheapestRooms(rakutenResponse)

	// 構造体をJSON形式のバイトスライスに変換
    jsonData, err := json.Marshal(cheapestRooms)
    if err != nil {
        http.Error(w, "Error marshaling JSON", http.StatusInternalServerError)
        return
    }

	// レスポンスヘッダーを設定
    w.Header().Set("Content-Type", "application/json")
    
    // JSONデータをHTTPレスポンスとして書き込む
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}


// 昇順にホテルを並べ替える
func sortRoomsByPriceAsc(rooms []HotelAndRoomInfo) []HotelAndRoomInfo{

	start := 0
	end := len(rooms) -1
	
	for start < end {
		index := start
		for index < end {

			if (rooms[index].Total > rooms[end].Total) {rooms[index], rooms[end] = rooms[end], rooms[index]}
			index += 1
		}
		end -= 1
	}

	if (len(rooms) > 10) {rooms = rooms[:10]}
	return rooms
}


// rakutenからのresponseの構造体を受け取り、最安の部屋10件のデータを返す (hotel情報と部屋情報)
func getCheapestRooms(rakutenResponse RakutenResponse) []HotelAndRoomInfo{

	// 10個以下ならスライスに追加
	var cheapestRooms []HotelAndRoomInfo
	var room HotelAndRoomInfo

    for _, hotelItem := range rakutenResponse.Hotels {
		// 値段を出力する
		for index, info := range hotelItem.Hotel {
			// 0番目はhotelBasicInfo
			if (index == 0) {
				hotelBasicInfo := info
				room.HotelName = hotelBasicInfo.HotelBasicInfo.HotelName
				room.HotelInformationURL = hotelBasicInfo.HotelBasicInfo.HotelInformationURL
				room.HotelImageURL = hotelBasicInfo.HotelBasicInfo.HotelImageURL
				continue
			}
			
			room.RoomName = info.RoomInfo[0].RoomBasicInfo.RoomName
			room.PlanName = info.RoomInfo[0].RoomBasicInfo.PlanName  
			room.ReserveURL = info.RoomInfo[0].RoomBasicInfo.ReserveURL
			room.RakutenCharge = info.RoomInfo[1].DailyCharge.RakutenCharge
			room.Total = info.RoomInfo[1].DailyCharge.Total
			room.ChargeFlag = info.RoomInfo[1].DailyCharge.ChargeFlag
			// 10件以下か最高尾のroomより安いなら追加する
			if (len(cheapestRooms) < 10 || room.Total < cheapestRooms[len(cheapestRooms) -1].Total) {
				// 部屋を追加
				cheapestRooms = append(cheapestRooms, room)
				// ソートして上位10部屋を抜き出す
				cheapestRooms = sortRoomsByPriceAsc(cheapestRooms)
				continue
			}
		}
    }
	return cheapestRooms

}

// エリア情報のjsonファイル用構造体
type AreaJson struct {
	AreaClasses struct {
		LargeClasses []struct {
			LargeClass []struct {
				LargeClassCode string `json:"largeClassCode,omitempty"`
				LargeClassName string `json:"largeClassName,omitempty"`
				MiddleClasses  []struct {
					MiddleClass []struct {
						MiddleClassCode string `json:"middleClassCode,omitempty"`
						MiddleClassName string `json:"middleClassName,omitempty"`
						SmallClasses    []struct {
							SmallClass []struct {
								SmallClassCode string `json:"smallClassCode,omitempty"`
								SmallClassName string `json:"smallClassName,omitempty"`
								DetailClasses  []struct {
									DetailClass struct {
										DetailClassCode string `json:"detailClassCode"`
										DetailClassName string `json:"detailClassName"`
									} `json:"detailClass"`
								} `json:"detailClasses,omitempty"`
							} `json:"smallClass"`
						} `json:"smallClasses,omitempty"`
					} `json:"middleClass"`
				} `json:"middleClasses,omitempty"`
			} `json:"largeClass"`
		} `json:"largeClasses"`
	} `json:"areaClasses"`
}

// middleClassName(都道府県名)を受け取り、smallClassCodeとsmallClassNameを返す関数
func smallClassSearchHandler(w http.ResponseWriter, r *http.Request) {
	// json ファイルから構造体作成
	/* 
	{
		"classcode",
		"className"
	}
	*/

    // JSONファイルを読み込む
    data, err := ioutil.ReadFile("area_info.json")
    if err != nil {
        log.Fatalf("Error reading file: %v", err)
    }


    var areaJson AreaJson
	err = json.Unmarshal(data, &areaJson)
    if err != nil {
        log.Fatalf("Error unmarshalling JSON: %v", err)
    }

    // 構造体の内容を表示
	// fmt.Printf("%+v\n", areaJson)
	
	query := r.URL.Query()
	middleClassName := query.Get("middleClassName")
	// middle class code で見つかるまで探索する
	// 見つかったらsmall class codeとnameを入れる
	var smallClasses []SmallClass
	var smallClass SmallClass
	for _, middleClassItem := range areaJson.AreaClasses.LargeClasses[0].LargeClass[1].MiddleClasses {
		// class
		if (middleClassItem.MiddleClass[0].MiddleClassName == middleClassName){
			smallClass.MiddleClassCode = middleClassItem.MiddleClass[0].MiddleClassCode
			// for でsmallClassを取得する
			for _, smallClassItem := range middleClassItem.MiddleClass[1].SmallClasses {
				smallClass.SmallClassCode = smallClassItem.SmallClass[0].SmallClassCode
				smallClass.SmallClassName = smallClassItem.SmallClass[0].SmallClassName
				// smallclasses配列に入れる
				smallClasses = append(smallClasses, smallClass)
			}

			
		}
	}

	// 構造体をJSON形式のバイトスライスに変換
    jsonData, err := json.Marshal(smallClasses)
    if err != nil {
        http.Error(w, "Error marshaling JSON", http.StatusInternalServerError)
        return
    }

	// レスポンスヘッダーを設定
    w.Header().Set("Content-Type", "application/json")
    
    // JSONデータをHTTPレスポンスとして書き込む
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}

// smallClassName(都道府県名)を受け取り、smallClassCodeとsmallClassNameを返す関数
func detailClassSearchHandler(w http.ResponseWriter, r *http.Request) {
	// json ファイルから構造体作成
	/* 
	{
	  "detailClassCode": "A",
 	  "detailClassName": "名古屋駅・伏見・丸の内"
	}
	*/

    // JSONファイルを読み込む
    data, err := ioutil.ReadFile("area_info.json")
    if err != nil {
        log.Fatalf("Error reading file: %v", err)
    }


    var areaJson AreaJson
	err = json.Unmarshal(data, &areaJson)
    if err != nil {
        log.Fatalf("Error unmarshalling JSON: %v", err)
    }

    // 構造体の内容を表示
	// fmt.Printf("%+v\n", areaJson)
	
	query := r.URL.Query()
	smallClassName := query.Get("smallClassName")
	// middle class code で見つかるまで探索する
	// 見つかったらsmall class codeとnameを入れる
	var detailClasses []DetailClass
	var detailClass DetailClass

	// middle classの探索
	for _, middleClassItem := range areaJson.AreaClasses.LargeClasses[0].LargeClass[1].MiddleClasses {
		// class

		// for でsmallClassを取得する
		for _, smallClassItem := range middleClassItem.MiddleClass[1].SmallClasses {
			// small class nameが一緒ならdetailClassを入れる
			if (smallClassItem.SmallClass[0].SmallClassName == smallClassName){
				// 1つならdetailclassなし。
				
				if (len(smallClassItem.SmallClass) <= 1){
					jsonData, err := json.Marshal(detailClasses)
					if err != nil {
						http.Error(w, "Error marshaling JSON", http.StatusInternalServerError)
						return
					}
				
					// レスポンスヘッダーを設定
					w.Header().Set("Content-Type", "application/json")
					
					// JSONデータをHTTPレスポンスとして書き込む
					w.WriteHeader(http.StatusOK)
					w.Write(jsonData)
					return

				} else {
					for _, detailClassItem := range smallClassItem.SmallClass[1].DetailClasses{
						detailClass.DetailClassCode = detailClassItem.DetailClass.DetailClassCode
						detailClass.DetailClassName = detailClassItem.DetailClass.DetailClassName
						// smallclasses配列Name
						detailClasses = append(detailClasses, detailClass)
					}

				}


			}



		}
	}

	// 構造体をJSON形式のバイトスライスに変換
    jsonData, err := json.Marshal(detailClasses)
    if err != nil {
        http.Error(w, "Error marshaling JSON", http.StatusInternalServerError)
        return
    }

	// レスポンスヘッダーを設定
    w.Header().Set("Content-Type", "application/json")
    
    // JSONデータをHTTPレスポンスとして書き込む
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}


