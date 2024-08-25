import HotelListView from "./view";

export const HotelListContainer = () => {
	// TODO: API繋ぎこみを行うこと
	// mockデータ
	const mockHotels = [
		{
			hotelName: "ホテルグレイスリー札幌",
			hotelInformationUrl: "https://www.example.com",
			hotelImageUrl: "https://img.travel.rakuten.co.jp/share/HOTEL/635/635.jpg",
			roomName: "■高層階エグゼクティブフロア■ツイン／喫煙・19平米",
			planName: "★タイムセール：食事なし★【今だけ最大20％OFF】",
			reserveUrl: "https://www.example.com/reserve",
			charge: 11875,
			total: 23750,
			chargeFlag: 0,
		},
		{
			hotelName: "ホテルサンプル",
			hotelInformationUrl: "https://www.samplehotel.com",
			hotelImageUrl:
				"https://img.travel.rakuten.co.jp/share/HOTEL/1234/1234.jpg",
			roomName: "スタンダードルーム／禁煙・20平米",
			planName: "★お得プラン：朝食付き★",
			reserveUrl: "https://www.samplehotel.com/reserve",
			charge: 15000,
			total: 30000,
			chargeFlag: 1,
		},
	];

	return <HotelListView hotels={mockHotels} />;
};
