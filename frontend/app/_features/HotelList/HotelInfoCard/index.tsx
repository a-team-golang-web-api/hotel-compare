import { Button } from "@/app/_components/elements/Button";
import Image from "next/image";
import type { HotelInfo } from "../type";

/**
 * ホテル情報を表示するカードコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.hotelName - ホテル名
 * @param {string} props.hotelInformationUrl - ホテルの紹介ページURL
 * @param {string} props.hotelImageUrl - ホテルの画像URL
 * @param {string} props.roomName - 部屋の名前
 * @param {string} props.planName - プラン名
 * @param {string} props.reserveUrl - 予約ページのURL
 * @param {number} props.charge - 料金 (1人あたりまたは1室あたり)
 * @param {number} props.total - 1泊の合計料金
 * @param {number} props.chargeFlag - 0なら1人あたり、1なら1室あたりの料金を表示
 * @returns {JSX.Element} ホテル情報カードのJSX要素
 */
export const HotelInfoCard = ({
	hotelName,
	hotelImageUrl,
	hotelInformationUrl,
	roomName,
	planName,
	rakutenCharge,
	total,
	reserveUrl,
	chargeFlag,
}: HotelInfo) => {
	const handleNavigate = () => {
		window.open(reserveUrl, "_blank");
	};

	// 料金の表示が1人あたりか1室あたりかを判定
	const chargeText = chargeFlag === 0 ? "1人あたり" : "1室あたり";

	return (
		<div className="card card-side bg-base-100 shadow-xl">
			<figure className="relative w-1/3 h-auto">
				<Image
					src={hotelImageUrl}
					alt={hotelName}
					layout="fill"
					objectFit="cover"
				/>
			</figure>
			<div className="card-body">
				<h2 className="card-title">
					<a
						href={hotelInformationUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 underline hover:text-blue-700"
					>
						{hotelName}
					</a>
				</h2>
				<p>{roomName}</p>
				<p>{planName}</p>
				<p>
					{chargeText}: ¥{rakutenCharge.toLocaleString()}
				</p>
				<p>合計: ¥{total.toLocaleString()}</p>
				<div className="card-actions justify-end">
					<Button
						text={"予約する"}
						btnColor="btn-primary"
						onClick={handleNavigate}
					/>
				</div>
			</div>
		</div>
	);
};
