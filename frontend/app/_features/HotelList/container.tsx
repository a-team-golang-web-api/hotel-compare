"use client";

import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import HotelListView from "./view";

export const HotelListContainer = () => {
	const hotels = useSelector((state: RootState) => state.hotels.hotels);

	return <HotelListView hotels={hotels} />;
};
