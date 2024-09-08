"use client";
import { setHotels } from "@/redux/reducers/hotelSlice";
import { getDetailClass } from "@/services/getDetailClass";
import { getHotelsInfo } from "@/services/getHotelsInfo";
import { getSmallClass } from "@/services/getSmallClass";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SearchbarView } from "./view";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const convertToSmallClassOption = (data: any[]) => {
	return data.map((item) => ({
		value: { name: item.smallClassName, code: item.smallClassCode },
		label: item.smallClassName,
	}));
};

const formatToDateString = (date: Dayjs) => {
	return date.format("YYYY-MM-DD");
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
		value: {
			name: string;
			code: string;
		};
		label: string;
	} | null>(null);

	const [selectedSmallClass, setSelectedSmallClass] = useState<{
		value: {
			name: string;
			code: string;
		};
		label: string;
	} | null>(null);

	const [selectedDetailClass, setSelectedDetailClass] = useState<{
		value: {
			name: string;
			code: string;
		};
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
					const data = await getSmallClass(selectedMiddleClass.value.name);
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
					const data = await getDetailClass(selectedSmallClass.value.name);
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
	const handleSelectedMiddleClass = (middleClass: any) => {
		setSelectedMiddleClass(middleClass);
		setSelectedSmallClass(null);
		setSelectedDetailClass(null);
		setDetailClassOptions(null);
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const hendleSelectedSmallClass = (smallClass: any) => {
		setSelectedSmallClass(smallClass);
		setSelectedDetailClass(null);
	};

	const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
	const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);

	const [selectedPeople, setSelectedPeople] = useState<{
		value: string;
		label: string;
	} | null>(null);

	const dispath = useDispatch();
	// ホテル情報取得API
	const handleSearchClick = async () => {
		if (
			selectedMiddleClass?.value &&
			selectedSmallClass &&
			selectedPeople &&
			checkInDate &&
			checkOutDate
		) {
			try {
				const data = await getHotelsInfo({
					middleClassName: selectedMiddleClass.value.code,
					smallClassName: selectedSmallClass?.value.code,
					detailClassName: selectedDetailClass?.value.code,
					adultNum: selectedPeople?.value,
					checkInDate: formatToDateString(checkInDate),
					checkOutDate: formatToDateString(checkOutDate),
				});
				dispath(setHotels(data));
			} catch (error) {
				console.error(error);
			}
		}
	};

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
			onSearchClick={handleSearchClick}
		/>
	);
};
