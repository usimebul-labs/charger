import { upsertStations } from '@/app/actions/charger';
import { NextResponse } from 'next/server';
import { isAvailable, CHARGER_TYPES } from '@/app/(home)/_utils/charger';
import { createClient } from '@/supabase/server';
import { cookies } from 'next/headers';
import { push } from '@/services/pushService';

export async function GET(req: Request) {
    const chargers = await upsertStations();

    const availableFastCount = chargers.filter((s) => s.type.code === CHARGER_TYPES.RAPID && isAvailable(s.status.code)).length;
    const availableSlowCount = chargers.filter((s) => s.type.code === CHARGER_TYPES.SLOW && isAvailable(s.status.code)).length;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let waitings: any[] = [];

    if (availableFastCount > 0) {
        const { data: fastWaitings } = await supabase
            .from('charger_waitings')
            .select('*')
            .eq('type_code', CHARGER_TYPES.RAPID)
            .order('created_at', { ascending: true })
            .limit(availableFastCount);

        if (fastWaitings) waitings = [...waitings, ...fastWaitings];
    }

    if (availableSlowCount > 0) {
        const { data: slowWaitings } = await supabase
            .from('charger_waitings')
            .select('*')
            .eq('type_code', CHARGER_TYPES.SLOW)
            .order('created_at', { ascending: true })
            .limit(availableSlowCount);

        if (slowWaitings) waitings = [...waitings, ...slowWaitings];
    }

    console.log("waitings", waitings)

    for (const waiting of waitings) {
        await push(waiting.subscription, {
            title: `${waiting.type_code === CHARGER_TYPES.RAPID ? "급속" : "완속"} 충전 가능 알림`,
            body: `충전 가능한 스테이션이 생겼어요!\n아래에서 확인해보세요.`
        });
    }

    return NextResponse.json({
        chargers,
        availableCounts: {
            fast: availableFastCount,
            slow: availableSlowCount
        },
        waitings
    });
}