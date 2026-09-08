import { CHARGER_TYPES } from "@/app/(home)/_utils/charger";
import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import { buildStatistics, type ChargerMeta, type ChargerStatistics, type StatusLogRow } from "./stats";

/** 통계에 쓰는 관측 창. 요일별 패턴이 드러날 만큼 길되, 읽어오는 행 수는 묶어둔다. */
const WINDOW_DAYS = 120;

/** PostgREST 한 번에 가져오는 행 수 (기본 상한과 동일) */
const PAGE_SIZE = 1000;

/** 폭주 방지 — WINDOW_DAYS 안에서 이보다 많이 쌓이면 오래된 쪽이 잘린다 */
const MAX_PAGES = 20;

/**
 * 통계 페이지는 로그인 상태와 무관한 공개 집계라 쿠키를 읽지 않는다.
 * (쿠키를 건드리면 페이지가 동적 렌더링으로 떨어져 ISR 캐시가 무력화된다.)
 */
const publicClient = () =>
    createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        { auth: { persistSession: false } }
    );

export async function getChargerStatistics(): Promise<ChargerStatistics | null> {
    const supabase = publicClient();

    // 급속은 5개월 동안 이용이 수십 건에 그쳐 패턴이라 부를 표본이 없다. 완속만 센다.
    const { data: infos, error: infoError } = await supabase
        .from("charger_infos")
        .select("id, search_key, floor")
        .eq("type_code", CHARGER_TYPES.SLOW)
        .order("id", { ascending: true });

    if (infoError || !infos || infos.length === 0) {
        if (infoError) console.error("완속 충전기 조회 실패:", infoError);
        return null;
    }

    const chargers: ChargerMeta[] = infos.map((info) => ({
        id: info.id,
        searchKey: info.search_key,
        floor: info.floor,
    }));

    const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const rows: StatusLogRow[] = [];

    for (let page = 0; page < MAX_PAGES; page++) {
        const { data, error } = await supabase
            .from("charger_status_logs")
            .select("charger_id, old_status_code, new_status_code, changed_at")
            .in("charger_id", chargers.map((c) => c.id))
            .gte("changed_at", since)
            .order("changed_at", { ascending: true })
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) {
            console.error("통계 로그 조회 실패:", error);
            return null;
        }
        if (!data || data.length === 0) break;

        rows.push(...data);
        if (data.length < PAGE_SIZE) break;
    }

    return buildStatistics(rows, chargers);
}
