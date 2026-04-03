import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    // 1. 보안 설정: Vercel Cron 요청인지 확인 (필수)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 비즈니스 로직 실행
    console.log("Cron 작업이 실행되었습니다.");

    return NextResponse.json({ success: true });
}