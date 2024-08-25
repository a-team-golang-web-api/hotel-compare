import HotelList from "./_features/HotelList";
import Searchbar from "./_features/Searchbar";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between ">
			<Searchbar />
			<HotelList />
		</main>
	);
}
