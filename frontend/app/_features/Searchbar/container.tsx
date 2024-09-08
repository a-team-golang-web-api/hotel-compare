"use client";
import { getDetailClass } from "@/services/getDetailClass";
import { getSmallClass } from "@/services/getSmallClass";
import { useEffect, useState } from "react";
import { SearchbarView } from "./view";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const convertToSmallClassOption = (data: any[]) => {
	return data.map((item) => ({
		value: item.smallClassName,
		label: item.smallClassName,
	}));
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const convertToDetailClassOptions = (data: any[]) => {
	return data.map((item) => ({
		value: item.detailClassName,
		label: item.detailClassName,
	}));
};

export const SearchbarContainer = () => {
	const [selectedMiddleClass, setSelectedMiddleClass] = useState<{
		value: string;
		label: string;
	} | null>(null);

	const [selectedSmallClass, setSelectedSmallClass] = useState<{
		value: string;
		label: string;
	} | null>(null);

	const [selectedDetailClass, setSelectedDetailClass] = useState<{
		value: string;
		label: string;
	} | null>(null);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [smallClassOptions, setSmallClassOptions] = useState<any>(null);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [detailClassOptions, setDetailClassOptions] = useState<any>(null);

	// SmallClass取得API
	useEffect(() => {
		const getSmallClassOptions = async () => {
			if (selectedMiddleClass?.value) {
				try {
					const data = await getSmallClass(selectedMiddleClass.value);
					const smallClassOptions = convertToSmallClassOption(data);
					setSmallClassOptions(smallClassOptions);
				} catch (error) {
					console.error(error);
				}
			}
		};
		getSmallClassOptions();
	}, [selectedMiddleClass]);

	// DetailClass取得API
	useEffect(() => {
		const getDetailClassOptions = async () => {
			if (selectedSmallClass?.value) {
				try {
					const data = await getDetailClass(selectedSmallClass.value);
					const smallClassOptions = convertToDetailClassOptions(data);
					setDetailClassOptions(smallClassOptions);
				} catch (error) {
					console.error(error);
				}
			}
		};
		getDetailClassOptions();
	}, [selectedSmallClass]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleSelectedMiddleClass = (middleClassName: any) => {
		setSelectedMiddleClass(middleClassName);
		setSelectedSmallClass(null);
		setSelectedDetailClass(null);
		setDetailClassOptions(null);
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const hendleSelectedSmallClass = (smallClassName: any) => {
		setSelectedSmallClass(smallClassName);
		setSelectedDetailClass(null);
	};

	const [checkInDate, setCheckInDate] = useState("");
	const [checkOutDate, setCheckOutDate] = useState("");

	const [selectedPeople, setSelectedPeople] = useState<{
		value: string;
		label: string;
	} | null>(null);

	return (
		<SearchbarView
			selectedMiddleClass={selectedMiddleClass}
			selectedSmallClass={selectedSmallClass}
			selectedDetailClass={selectedDetailClass}
			onMiddleClassChange={handleSelectedMiddleClass}
			onSmallClassChange={hendleSelectedSmallClass}
			onDetailClassChange={setSelectedDetailClass}
			smallClassOptions={smallClassOptions}
			detailClassOptions={detailClassOptions}
			checkInDate={checkInDate}
			checkOutDate={checkOutDate}
			onCheckInDateChange={setCheckInDate}
			onCheckOutDateChange={setCheckOutDate}
			selectedPeople={selectedPeople}
			setSelectedPeople={setSelectedPeople}
		/>
	);
};
