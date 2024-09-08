import { path, handleFailed, handleSucceed } from "..";

export async function getHotelsInfo({
	middleClassName,
	smallClassName,
	detailClassName,
	adultNum,
	checkInDate,
	checkOutDate,
}: {
	middleClassName: string;
	smallClassName: string;
	detailClassName?: string; // オプショナル
	adultNum: string;
	checkInDate: string;
	checkOutDate: string;
}) {
	// クエリパラメータの設定
	const params = new URLSearchParams({
		middleClassName: middleClassName,
		smallClassName: smallClassName,
		adultNum,
		checkInDate,
		checkOutDate,
	});

	// detailClassName が存在する場合のみクエリに追加
	if (detailClassName) {
		params.append("detailClassName", detailClassName);
	}

	const url = path(`/api/hotels?${params}`);

	try {
		const response = await fetch(url);
		return handleSucceed(response);
	} catch (error) {
		return handleFailed(error);
	}
}
