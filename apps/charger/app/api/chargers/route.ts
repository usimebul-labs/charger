import { NextRequest, NextResponse } from "next/server";

// 타입 정의는 별도 파일(types/charger.ts)에서 가져오는 것이 좋습니다.
export async function GET(request: NextRequest) {
    const url = `https://www.humaxcharger.com/user/find/view/2355`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "x-csrf-token": process.env.X_CSRF_TOKEN || "", // 환경변수에서 관리
                "cookie": request.headers.get("cookie") || "", // 클라이언트의 쿠키를 전달해야 할 경우
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch from external API" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}