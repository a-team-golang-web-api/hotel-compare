"use client";

import { HotelInfoCard } from "./HotelInfoCard";
import type { HotelInfo } from "./type";

interface HotelListProps {
	hotels: Array<HotelInfo>;
}

/**
 * ホテル情報のリストを表示するコンポーネント
 *
 * @param {Array<Object>} props.hotels - ホテル情報の配列
 * @returns {JSX.Element} ホテル情報リストのJSX要素
 */
const HotelListView = ({ hotels }: HotelListProps): JSX.Element => {
	return (
		<div className="space-y-4 w-full max-w-4xl mx-auto ">
			{hotels.map((hotel) => (
				<div key={hotel.hotelName} className="w-full">
					<HotelInfoCard
						hotelName={hotel.hotelName}
						hotelInformationUrl={hotel.hotelInformationUrl}
						hotelImageUrl={hotel.hotelImageUrl}
						roomName={hotel.roomName}
						planName={hotel.planName}
						reserveUrl={hotel.reserveUrl}
						charge={hotel.charge}
						total={hotel.total}
						chargeFlag={hotel.chargeFlag}
					/>
				</div>
			))}
		</div>
	);
};

export default HotelListView;
