"use client";

import { Button } from "@/app/_components/elements/Button";
import { middleClassOption } from "@/app/_features/Searchbar/middleClassOption";
import { useState } from "react";
import Selectbox from "../../_components/elements/Selectbox";
import DateSelectbox from "./DateSelectbox";

const generatePeopleOptions = (maxPeople: number) => {
	return Array.from({ length: maxPeople }, (_, i) => ({
		value: (i + 1).toString(),
		label: `${i + 1}人`,
	}));
};

type SearchbarViewProps = {
	selectedMiddleClass: { value: string; label: string } | null;
	onMiddleClassChange: (
		newValue: { value: string; label: string } | null,
	) => void;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	smallClassOptions: any;
};

/**
 * 検索バーのビューコンポーネント
 *
 * 目的地の選択、チェックイン日とチェックアウト日の選択、人数の選択を含む。
 */
export const SearchbarView = ({
	selectedMiddleClass,
	onMiddleClassChange,
	smallClassOptions,
}: SearchbarViewProps) => {
	const [checkInDate, setCheckInDate] = useState("");
	const [checkOutDate, setCheckOutDate] = useState("");

	return (
		<div className="container mx-auto p-4 space-y-4 bg-white shadow-lg rounded-lg">
			<div className="flex items-end space-x-3 z-10">
				<DateSelectbox
					labelText="チェックイン"
					value={checkInDate}
					onChange={(newValue) => setCheckInDate(newValue)}
				/>
				<DateSelectbox
					labelText="チェックアウト"
					value={checkOutDate}
					onChange={(newValue) => setCheckOutDate(newValue)}
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
						value={smallClassOptions[0]}
						onChange={onMiddleClassChange}
					/>
				)}
			</div>

			<div className="container flex justify-between items-end space-x-3">
				<Selectbox
					labelText="人数"
					options={generatePeopleOptions(10)}
					value={null}
					onChange={(
						selectedOption: { value: string; label: string } | null,
					): void => {
						throw new Error("Function not implemented.");
					}}
				/>
				<Button text="検索" btnColor="btn-neutral" />
			</div>
		</div>
	);
};
