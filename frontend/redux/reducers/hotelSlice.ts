import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

// ホテル情報の型定義
interface Hotel {
	hotelName: string;
	hotelInformationUrl: string;
	hotelImageUrl: string;
	roomName: string;
	planName: string;
	reserveUrl: string;
	rakutenCharge: number;
	total: number;
	chargeFlag: number;
}

// スライスの状態の型定義
interface HotelState {
	hotels: Hotel[];
}

// 初期状態
const initialState: HotelState = {
	hotels: [],
};

// ホテル情報スライス
export const hotelSlice = createSlice({
	name: "hotels",
	initialState,
	reducers: {
		// ホテル情報を保存するアクション
		setHotels: (state, action: PayloadAction<Hotel[]>) => {
			state.hotels = action.payload;
		},
		// ホテル情報をクリアするアクション
		clearHotels: (state) => {
			state.hotels = [];
		},
	},
});

// アクションのエクスポート
export const { setHotels, clearHotels } = hotelSlice.actions;

// Reducerのエクスポート
export default hotelSlice.reducer;
