import { isAvailable } from "@/app/(home)/_utils/charger";

/** 로그 원본에서 집계에 필요한 최소 필드 */
export interface StatusLogRow {
    charger_id: number | null;
    old_status_code: string | null;
    new_status_code: string | null;
    changed_at: string | null;
}

/** 통계에 넣을 충전기 정보 (완속만 넘어온다) */
export interface ChargerMeta {
    id: number;
    searchKey: number;
    floor: string | null;
}

/** 히트맵 한 칸 — 요일 × 시간 */
export interface HeatCell {
    /** 0=일 … 6=토 (KST) */
    dow: number;
    /** 0–23 (KST) */
    hour: number;
    /** 충전기가 사용 중이라 바로 꽂을 수 없었던 비율. 관측이 없으면 null */
    busyRatio: number | null;
    /** 5분 단위 표본 수 — 신뢰도 판단용 */
    samples: number;
}

/** 골든타임 한 칸 — 시간대별 "자리가 난 순간" */
export interface GoldenSlot {
    hour: number;
    /** 관측 기간 전체에서 자리가 난 총 횟수 */
    total: number;
    /** 관측일 기준 하루 평균 발생 횟수 */
    perDay: number;
}

/** 분 단위 분포 요약 */
export interface DurationSummary {
    count: number;
    median: number;
    average: number;
    p90: number;
    max: number;
}

/** 충전이 끝난 뒤에도 자리를 지킨 시간 — "매너 지수" */
export interface AbandonSummary extends DurationSummary {
    /** 30분을 넘긴 비율 */
    over30Ratio: number;
    /** 1시간을 넘긴 비율 */
    over60Ratio: number;
}

/** 충전기 한 대의 이용 실적 */
export interface ChargerRank {
    id: number;
    searchKey: number;
    floor: string | null;
    /** 충전이 시작된 횟수 */
    sessions: number;
    /** 관측된 시간 중 충전 중이었던 시간 (시간 단위) */
    occupiedHours: number;
    /** 하루 안에 끝난 충전의 중앙값 (분). 표본이 없으면 null */
    medianMinutes: number | null;
}

export interface DailyRhythm {
    /** 하루 평균 충전 시작 횟수 */
    averageStarts: number;
    busiestDay: { date: string; starts: number } | null;
}

export interface ChargerStatistics {
    /** 관측 구간 (ISO) */
    from: string;
    to: string;
    /** 로그가 하루라도 찍힌 날짜 수 */
    observedDays: number;
    totalLogs: number;
    /** 통계에 포함된 완속 충전기 수 */
    chargerCount: number;
    /** 관측이 있었던 요일 (오름차순) */
    dows: number[];
    /** 관측이 있었던 시간대 (오름차순) */
    hours: number[];
    heatmap: HeatCell[];
    golden: GoldenSlot[];
    /** 가장 혼잡한 칸 */
    peak: HeatCell | null;
    /** 가장 한산한 칸 */
    quietest: HeatCell | null;
    /** 한 번 충전에 걸린 시간 */
    charging: DurationSummary | null;
    /** 충전이 끝난 뒤 자리를 비우기까지 걸린 시간 */
    abandon: AbandonSummary | null;
    /** 충전기별 이용 실적 — 점유 시간 내림차순 */
    ranking: ChargerRank[];
    daily: DailyRhythm;
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 점유율을 재는 간격. 크론 폴링 주기(5분)와 맞춘다. */
const SAMPLE_MS = 5 * 60 * 1000;

/**
 * (요일, 시간) 칸을 "관측됨"으로 인정하는 최소 날짜 수.
 *
 * 크론이 도는 시간에만 로그가 쌓이므로, 로그의 존재 자체가 폴링의 흔적이다.
 * 1일이면 공휴일 근무 같은 단발성 기록까지 칸으로 잡히므로 2일을 하한으로 둔다.
 */
const MIN_OBSERVED_DAYS = 2;

/** UTC 타임스탬프를 KST 기준 달력값으로 읽기 위한 시프트 */
const toKst = (ms: number) => new Date(ms + KST_OFFSET_MS);

const bucketKey = (dow: number, hour: number) => `${dow}-${hour}`;

const dateKey = (d: Date) => d.toISOString().slice(0, 10);

/** 상태 구간 하나 — 연속한 두 로그 사이 */
interface Interval {
    chargerId: number;
    code: string;
    minutes: number;
    /**
     * 시작부터 끝까지 전부 관측 구간 안에 든 구간인지.
     *
     * 금요일 저녁에 시작해 월요일 아침에 끝난 구간은 실제 지속 시간을 알 수 없다
     * (그 사이 폴링이 없었으므로). 지속 시간 통계는 이 구간만 쓴다.
     */
    contained: boolean;
    /** 관측된 칸 안에 든 5분 표본 수 */
    observedSamples: number;
}

const summarise = (values: number[]): DurationSummary | null => {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const at = (p: number) => sorted[Math.floor((sorted.length - 1) * p)]!;
    return {
        count: sorted.length,
        median: Math.round(at(0.5)),
        average: Math.round(sorted.reduce((sum, v) => sum + v, 0) / sorted.length),
        p90: Math.round(at(0.9)),
        max: Math.round(at(1)),
    };
};

/**
 * 상태 변경 로그를 통계로 접는다.
 *
 * 로그는 "변화의 순간"만 남기므로, 연속한 두 로그 사이가 곧 그 상태로 머문 구간이다.
 * 이 구간을 5분 간격으로 훑어 점유율을 얻고, "사용 불가 → 사용 가능" 전이를
 * 세어 골든타임을 얻는다.
 */
export function buildStatistics(
    rows: StatusLogRow[],
    chargers: ChargerMeta[]
): ChargerStatistics | null {
    const known = new Map(chargers.map((c) => [c.id, c]));

    const logs = rows
        .filter((r) => r.charger_id !== null && r.changed_at !== null && r.new_status_code !== null)
        .filter((r) => known.has(r.charger_id as number))
        .map((r) => ({
            chargerId: r.charger_id as number,
            oldCode: r.old_status_code,
            newCode: r.new_status_code as string,
            at: new Date(r.changed_at as string).getTime(),
        }))
        .filter((r) => Number.isFinite(r.at))
        .sort((a, b) => a.at - b.at);

    if (logs.length === 0) return null;

    const datasetEnd = logs[logs.length - 1]!.at;

    // ── 1. 관측 커버리지 ────────────────────────────────────────────────
    // 어떤 (요일, 시간) 칸에 로그가 며칠에 걸쳐 찍혔는지 센다.
    const daysPerBucket = new Map<string, Set<string>>();
    const observedDates = new Set<string>();

    for (const log of logs) {
        const k = toKst(log.at);
        const key = bucketKey(k.getUTCDay(), k.getUTCHours());
        const day = dateKey(k);
        observedDates.add(day);
        let bucket = daysPerBucket.get(key);
        if (!bucket) daysPerBucket.set(key, (bucket = new Set()));
        bucket.add(day);
    }

    const covered = new Set(
        [...daysPerBucket.entries()]
            .filter(([, days]) => days.size >= MIN_OBSERVED_DAYS)
            .map(([key]) => key)
    );

    if (covered.size === 0) return null;

    // ── 2. 상태 구간 복원 + 점유율 ─────────────────────────────────────
    // (크론이 멈춘 야간·주말을 가로지르는 구간까지 세면 그 시간대가 통째로
    //  "사용 중"으로 물들기 때문에, 커버리지 밖 표본은 버린다.)
    const byCharger = new Map<number, typeof logs>();
    for (const log of logs) {
        const list = byCharger.get(log.chargerId);
        if (list) list.push(log);
        else byCharger.set(log.chargerId, [log]);
    }

    const tally = new Map<string, { busy: number; total: number }>();
    const intervals: Interval[] = [];

    for (const chargerLogs of byCharger.values()) {
        for (let i = 0; i < chargerLogs.length; i++) {
            const start = chargerLogs[i]!.at;
            // 마지막 로그는 다음 변화가 없으므로, 관측 종료 시점까지 그 상태가 이어진 것으로 본다.
            const end = i + 1 < chargerLogs.length ? chargerLogs[i + 1]!.at : datasetEnd;
            if (end <= start) continue;

            const code = chargerLogs[i]!.newCode;
            const busy = !isAvailable(code);
            let observedSamples = 0;
            let contained = true;

            for (let t = start; t < end; t += SAMPLE_MS) {
                const k = toKst(t);
                const key = bucketKey(k.getUTCDay(), k.getUTCHours());
                if (!covered.has(key)) {
                    contained = false;
                    continue;
                }

                observedSamples++;
                let cell = tally.get(key);
                if (!cell) tally.set(key, (cell = { busy: 0, total: 0 }));
                cell.total++;
                if (busy) cell.busy++;
            }

            intervals.push({
                chargerId: chargerLogs[i]!.chargerId,
                code,
                minutes: (end - start) / 60000,
                contained,
                observedSamples,
            });
        }
    }

    // ── 3. 골든타임 ────────────────────────────────────────────────────
    // "쓸 수 없던 충전기가 쓸 수 있게 된" 전이만 센다.
    const freeUps = new Array<number>(24).fill(0);
    for (const log of logs) {
        if (!isAvailable(log.newCode)) continue;
        if (log.oldCode !== null && isAvailable(log.oldCode)) continue;

        const k = toKst(log.at);
        if (!covered.has(bucketKey(k.getUTCDay(), k.getUTCHours()))) continue;
        freeUps[k.getUTCHours()]!++;
    }

    // ── 4. 지속 시간 통계 ──────────────────────────────────────────────
    // 관측 구간을 벗어나지 않은 구간만 쓴다 — 나머지는 실제 길이를 알 수 없다.
    const chargingRuns = intervals.filter((iv) => iv.code === "6" && iv.contained);
    const abandonRuns = intervals.filter((iv) => (iv.code === "8" || iv.code === "9") && iv.contained);

    const charging = summarise(chargingRuns.map((iv) => iv.minutes));
    const abandonBase = summarise(abandonRuns.map((iv) => iv.minutes));
    const abandon: AbandonSummary | null = abandonBase
        ? {
            ...abandonBase,
            over30Ratio: abandonRuns.filter((iv) => iv.minutes > 30).length / abandonRuns.length,
            over60Ratio: abandonRuns.filter((iv) => iv.minutes > 60).length / abandonRuns.length,
        }
        : null;

    // ── 5. 충전기별 실적 ───────────────────────────────────────────────
    const ranking: ChargerRank[] = chargers
        .map((meta) => {
            const runs = intervals.filter((iv) => iv.chargerId === meta.id && iv.code === "6");
            const contained = runs.filter((iv) => iv.contained).map((iv) => iv.minutes);
            const median = summarise(contained)?.median ?? null;

            return {
                id: meta.id,
                searchKey: meta.searchKey,
                floor: meta.floor,
                sessions: runs.length,
                occupiedHours: Math.round((runs.reduce((sum, iv) => sum + iv.observedSamples, 0) * 5) / 60),
                medianMinutes: median,
            };
        })
        .sort((a, b) => b.occupiedHours - a.occupiedHours);

    // ── 6. 하루 리듬 ───────────────────────────────────────────────────
    const startsPerDay = new Map<string, number>();
    for (const log of logs) {
        if (log.newCode !== "6") continue;
        const day = dateKey(toKst(log.at));
        startsPerDay.set(day, (startsPerDay.get(day) ?? 0) + 1);
    }
    const busiest = [...startsPerDay.entries()].reduce<{ date: string; starts: number } | null>(
        (best, [date, starts]) => (!best || starts > best.starts ? { date, starts } : best),
        null
    );
    const totalStarts = [...startsPerDay.values()].reduce((sum, v) => sum + v, 0);

    // ── 7. 조립 ────────────────────────────────────────────────────────
    const dows = [...new Set([...covered].map((key) => Number(key.split("-")[0])))].sort((a, b) => a - b);
    const hours = [...new Set([...covered].map((key) => Number(key.split("-")[1])))].sort((a, b) => a - b);

    const heatmap: HeatCell[] = [];
    for (const dow of dows) {
        for (const hour of hours) {
            const cell = tally.get(bucketKey(dow, hour));
            heatmap.push({
                dow,
                hour,
                busyRatio: cell && cell.total > 0 ? cell.busy / cell.total : null,
                samples: cell?.total ?? 0,
            });
        }
    }

    const measured = heatmap.filter((c) => c.busyRatio !== null);
    const observedDays = observedDates.size;

    const golden: GoldenSlot[] = hours.map((hour) => ({
        hour,
        total: freeUps[hour]!,
        perDay: observedDays > 0 ? freeUps[hour]! / observedDays : 0,
    }));

    return {
        from: new Date(logs[0]!.at).toISOString(),
        to: new Date(datasetEnd).toISOString(),
        observedDays,
        totalLogs: logs.length,
        chargerCount: chargers.length,
        dows,
        hours,
        heatmap,
        golden,
        peak: measured.reduce<HeatCell | null>((best, c) => (!best || c.busyRatio! > best.busyRatio! ? c : best), null),
        quietest: measured.reduce<HeatCell | null>((best, c) => (!best || c.busyRatio! < best.busyRatio! ? c : best), null),
        charging,
        abandon,
        ranking,
        daily: {
            averageStarts: startsPerDay.size > 0 ? totalStarts / startsPerDay.size : 0,
            busiestDay: busiest,
        },
    };
}

/** 지금 이 순간의 KST 요일·시각 */
export const nowInKst = () => {
    const k = toKst(Date.now());
    return { dow: k.getUTCDay(), hour: k.getUTCHours(), minute: k.getUTCMinutes() };
};

export const DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/**
 * 혼잡도 5단계 — 색 램프의 인덱스(0–4)와 1:1로 대응한다.
 *
 * 경계는 완속 가동률이 실제로 오르내리는 폭(대략 5–80%)에 맞춰 잡았다.
 * 관측 기간이 달라져도 같은 색이 같은 뜻이도록 고정값으로 둔다.
 */
export const HEAT_LEVELS = [
    { max: 0.2, label: "매우 여유" },
    { max: 0.35, label: "여유" },
    { max: 0.5, label: "보통" },
    { max: 0.65, label: "혼잡" },
    { max: Infinity, label: "매우 혼잡" },
] as const;

export const heatLevel = (ratio: number) => HEAT_LEVELS.findIndex((l) => ratio < l.max);

/** `0.63` → `63%` */
export const asPercent = (ratio: number) => `${Math.round(ratio * 100)}%`;

/**
 * 가동률을 빈자리 대수로 되돌린다.
 *
 * 혼잡도는 (충전기 × 5분) 슬롯 중 사용 중이던 비율이라, 대수를 곱하면
 * 그 시간대에 평균 몇 대가 비어 있었는지가 그대로 나온다.
 */
export const freeChargers = (busyRatio: number, chargerCount: number) =>
    (1 - busyRatio) * chargerCount;

/** `9` → `오전 9시` */
export const formatHour = (hour: number) => {
    const meridiem = hour < 12 ? "오전" : "오후";
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${meridiem} ${h}시`;
};

/** `2026-04-09` → `4월 9일` */
export const formatDate = (isoDay: string) => {
    const [, month, day] = isoDay.split("-");
    return `${Number(month)}월 ${Number(day)}일`;
};
