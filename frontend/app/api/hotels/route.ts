import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	// 必須パラメータの取得
	const middleClassName = searchParams.get("middleClassName");
	const smallClassName = searchParams.get("smallClassName");
	const detailClassName = searchParams.get("detailClassName");
	const adultNum = searchParams.get("adultNum");
	const checkInDate = searchParams.get("checkInDate");
	const checkOutDate = searchParams.get("checkOutDate");

	// 必須パラメータのバリデーション
	if (
		!middleClassName ||
		!smallClassName ||
		!adultNum ||
		!checkInDate ||
		!checkOutDate
	) {
		return NextResponse.json(
			{ error: "Missing required parameters" },
			{ status: 400 },
		);
	}

	try {
		// クエリパラメータの設定
		const params = new URLSearchParams({
			middleClassCode: middleClassName,
			smallClassCode: smallClassName,
			adultNum: adultNum,
			checkinDate: checkInDate,
			checkoutDate: checkOutDate,
		});

		// detailClassName が存在する場合のみクエリに追加
		if (detailClassName) {
			params.append("detailClassCode", encodeURIComponent(detailClassName));
		}

		// API 呼び出し
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rakuten?${params}`,
		);

		// レスポンスが成功していない場合のエラーハンドリング
		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch data from external API" },
				{ status: response.status },
			);
		}

		// 成功時のデータ処理
		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		// キャッチされたエラーに対するレスポンス
		console.error("Error fetching data: ", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
