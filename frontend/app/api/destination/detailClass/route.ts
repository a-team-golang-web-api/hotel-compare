import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const smallClassName = searchParams.get("smallClassName");

	if (!smallClassName) {
		return NextResponse.json(
			{ error: "smallClassName is required" },
			{ status: 400 },
		);
	}

	// middleClassNameをエンコード
	const encodedSmallClassName = encodeURIComponent(smallClassName);

	// API 呼び出し
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/detail-class?smallClassName=${encodedSmallClassName}`,
	);
	const data = await response.json();

	// レスポンスの返却
	return NextResponse.json(data);
}
