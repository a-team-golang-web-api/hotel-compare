import type { Meta, StoryObj } from "@storybook/react";

import { HotelInfoCard } from ".";

const meta: Meta<typeof HotelInfoCard> = {
	title: "features/HotelList/HotelInfoCard",
	component: HotelInfoCard,
};

export default meta;
type Story = StoryObj<typeof HotelInfoCard>;

export const Default: Story = {
	args: {
		hotelName: "ホテルグレイスリー札幌",
		hotelInformationUrl:
			"https://img.travel.rakuten.co.jp/image/tr/api/re/pvonD/?f_no=635",
		hotelImageUrl: "https://img.travel.rakuten.co.jp/share/HOTEL/635/635.jpg",
		roomName: "■高層階エグゼクティブフロア■ツイン／喫煙・19平米",
		planName:
			"★タイムセール：食事なし★【今だけ最大20％OFF】札幌駅徒歩1分＆地下街直結＋最大21時間ステイ",
		reserveUrl:
			"https://img.travel.rakuten.co.jp/image/tr/api/re/IdsCY/?f_no=635&f_syu=12te&f_hi1=2024-08-24&f_hi2=2024-08-28&f_heya_su=1&f_otona_su=2&f_s1=0&f_s2=0&f_y1=0&f_y2=0&f_y3=0&f_y4=0&f_camp_id=5979611",
		rakutenCharge: 11875,
		total: 23750,
		chargeFlag: 0,
	},
};

export const PerRoom: Story = {
	args: {
		hotelName: "ホテルグレイスリー札幌",
		hotelInformationUrl:
			"https://img.travel.rakuten.co.jp/image/tr/api/re/pvonD/?f_no=635",
		hotelImageUrl: "https://img.travel.rakuten.co.jp/share/HOTEL/635/635.jpg",
		roomName: "■高層階エグゼクティブフロア■ツイン／喫煙・19平米",
		planName:
			"★タイムセール：食事なし★【今だけ最大20％OFF】札幌駅徒歩1分＆地下街直結＋最大21時間ステイ",
		reserveUrl:
			"https://img.travel.rakuten.co.jp/image/tr/api/re/IdsCY/?f_no=635&f_syu=12te&f_hi1=2024-08-24&f_hi2=2024-08-28&f_heya_su=1&f_otona_su=2&f_s1=0&f_s2=0&f_y1=0&f_y2=0&f_y3=0&f_y4=0&f_camp_id=5979611",
		rakutenCharge: 11875,
		total: 23750,
		chargeFlag: 1,
	},
};
