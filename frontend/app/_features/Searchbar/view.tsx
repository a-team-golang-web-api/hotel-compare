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
	selectedSmallClass: { value: string; label: string } | null;
	selectedDetailClass: { value: string; label: string } | null;
	onMiddleClassChange: (
		newValue: { value: string; label: string } | null,
	) => void;
	onSmallClassChange: (
		newValue: { value: string; label: string } | null,
	) => void;
	onDetailClassChange: (
		newValue: { value: string; label: string } | null,
	) => void;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	smallClassOptions: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	detailClassOptions: any;
	checkInDate: string;
	checkOutDate: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onCheckInDateChange: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onCheckOutDateChange: any;
	selectedPeople: { value: string; label: string } | null;
	setSelectedPeople: (
		newValue: { value: string; label: string } | null,
	) => void;
};

/**
 * 検索バーのビューコンポーネント
 *
 * 目的地の選択、チェックイン日とチェックアウト日の選択、人数の選択を含む。
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
}: SearchbarViewProps) => {
	return (
		<div className="container mx-auto p-4 space-y-4 bg-white shadow-lg rounded-lg">
			<div className="flex items-end space-x-3 z-10">
				<DateSelectbox
					labelText="チェックイン"
					value={checkInDate}
					onChange={(newValue) => onCheckInDateChange(newValue)}
				/>
				<DateSelectbox
					labelText="チェックアウト"
					value={checkOutDate}
					onChange={(newValue) => onCheckOutDateChange(newValue)}
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
				<Button text="検索" btnColor="btn-neutral" />
			</div>
		</div>
	);
};
