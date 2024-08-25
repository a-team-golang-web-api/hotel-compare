"use client";

import { Button } from "@/app/_components/elements/Button";
import { destinationOption } from "@/app/_components/elements/Selectbox/destinationOption";
import { useState } from "react";
import Selectbox from "../../_components/elements/Selectbox";
import DateSelectbox from "./DateSelectbox";

const generatePeopleOptions = (maxPeople: number) => {
	return Array.from({ length: maxPeople }, (_, i) => ({
		value: (i + 1).toString(),
		label: `${i + 1}人`,
	}));
};

/**
 * 検索バーのビューコンポーネント
 *
 * 目的地の選択、チェックイン日とチェックアウト日の選択、人数の選択を含む。
 */
export const SearchbarView = () => {
	const [checkInDate, setCheckInDate] = useState("");
	const [checkOutDate, setCheckOutDate] = useState("");

	return (
		<div className="container mx-auto p-4 space-y-4">
			<div className="container flex items-end space-x-3">
				{/* TODO: destinationOptionは仮置き。apiから取得する */}
				<Selectbox labelText="目的地" options={destinationOption} />
				<Selectbox options={destinationOption} />
				<Selectbox options={destinationOption} />
			</div>
			<div className="flex items-end space-x-3">
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
			<div className="container flex justify-between items-end space-x-3">
				<Selectbox labelText="人数" options={generatePeopleOptions(10)} />
				<Button text="検索" btnColor="btn-neutral" />
			</div>
		</div>
	);
};
