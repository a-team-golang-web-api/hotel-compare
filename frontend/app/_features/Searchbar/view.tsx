"use client";

import { Button } from "@/app/_components/elements/Button";
import { middleClassOption } from "@/app/_features/Searchbar/middleClassOption";
import type { Dayjs } from "dayjs";
import Selectbox from "../../_components/elements/Selectbox";
import DateSelectbox from "./DateSelectbox";

// 人数オプションを生成する関数
const generatePeopleOptions = (maxPeople: number) =>
	Array.from({ length: maxPeople }, (_, i) => ({
		value: (i + 1).toString(),
		label: `${i + 1}人`,
	}));

// オプション型の定義を再利用する
type OptionType = {
	value: {
		name: string;
		code: string;
	};
	label: string;
};

type SearchbarViewProps = {
	selectedMiddleClass: OptionType | null;
	selectedSmallClass: OptionType | null;
	selectedDetailClass: OptionType | null;
	onMiddleClassChange: (newValue: OptionType | null) => void;
	onSmallClassChange: (newValue: OptionType | null) => void;
	onDetailClassChange: (newValue: OptionType | null) => void;
	smallClassOptions: OptionType[] | null;
	detailClassOptions: OptionType[] | null;
	checkInDate: Dayjs | null;
	checkOutDate: Dayjs | null;
	onCheckInDateChange: (newValue: Dayjs | null) => void;
	onCheckOutDateChange: (newValue: Dayjs | null) => void;
	selectedPeople: { value: string; label: string } | null;
	setSelectedPeople: (
		newValue: { value: string; label: string } | null,
	) => void;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onSearchClick: any;
};

/**
 * 検索バーのビューコンポーネント
 */
export const SearchbarView = ({
	selectedMiddleClass,
	selectedSmallClass,
	selectedDetailClass,
	onMiddleClassChange,
	onSmallClassChange,
	onDetailClassChange,
	smallClassOptions,
	detailClassOptions,
	checkInDate,
	checkOutDate,
	onCheckInDateChange,
	onCheckOutDateChange,
	selectedPeople,
	setSelectedPeople,
	onSearchClick,
}: SearchbarViewProps) => {
	return (
		<div className="container mx-auto p-4 space-y-4 bg-white shadow-lg rounded-lg">
			<div className="flex items-end space-x-3 z-10">
				<DateSelectbox
					labelText="チェックイン"
					value={checkInDate}
					onChange={onCheckInDateChange}
				/>
				<DateSelectbox
					labelText="チェックアウト"
					value={checkOutDate}
					onChange={onCheckOutDateChange}
				/>
			</div>
			<div className="container flex items-end space-x-3 z-50">
				<Selectbox
					labelText="目的地"
					options={middleClassOption}
					value={selectedMiddleClass}
					onChange={onMiddleClassChange}
				/>
				{smallClassOptions && (
					<Selectbox
						options={smallClassOptions}
						value={selectedSmallClass}
						onChange={onSmallClassChange}
					/>
				)}
				{detailClassOptions && (
					<Selectbox
						options={detailClassOptions}
						value={selectedDetailClass}
						onChange={onDetailClassChange}
					/>
				)}
			</div>

			<div className="container flex justify-between items-end space-x-3">
				<Selectbox
					labelText="人数"
					options={generatePeopleOptions(10)}
					value={selectedPeople}
					onChange={setSelectedPeople}
				/>
				<Button text="検索" btnColor="btn-neutral" onClick={onSearchClick} />
			</div>
		</div>
	);
};
