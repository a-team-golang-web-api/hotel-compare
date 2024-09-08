import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const middleClassName = searchParams.get("middleClassName");

	if (!middleClassName) {
		console.log(middleClassName);
		return NextResponse.json(
			{ error: "middleClassName is required" },
			{ status: 400 },
		);
	}

	// middleClassNameをエンコード
	const encodedMiddleClassName = encodeURIComponent(middleClassName);

	// API 呼び出し
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/small-class?middleClassName=${encodedMiddleClassName}`,
	);
	const data = await response.json();

	// レスポンスの返却
	return NextResponse.json(data);
}
