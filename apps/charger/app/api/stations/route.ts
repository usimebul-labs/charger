import { getStations } from '@/app/actions/charger';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * 현황 폴링 엔드포인트.
 *
 * 서버 액션은 요청이 직렬화되어 라우터 전환까지 함께 지연시킨다. 5초마다 도는
 * 폴링은 액션 대신 이 핸들러를 쓰게 해서, 탭 이동이 폴링에 막히지 않게 한다.
 */
export async function GET() {
    const stations = await getStations();

    return NextResponse.json(stations, {
        headers: { 'Cache-Control': 'no-store' },
    });
}
