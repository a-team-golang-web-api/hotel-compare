"use client";
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

export const SearchbarContainer = () => {
	const [selectedMiddleClass, setSelectedMiddleClass] = useState<{
		value: string;
		label: string;
	} | null>(null);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [smallClassOptions, setSmallClassOptions] = useState<any>(null);

	// SmallClass取得API
	useEffect(() => {
		const smallClass = async () => {
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
		smallClass();
	}, [selectedMiddleClass]);

	return (
		<SearchbarView
			selectedMiddleClass={selectedMiddleClass}
			onMiddleClassChange={setSelectedMiddleClass}
			smallClassOptions={smallClassOptions}
		/>
	);
};
