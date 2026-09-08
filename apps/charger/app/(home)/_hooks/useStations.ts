"use client";

import { ChargerInfo } from "@/types/charger";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect } from "react";

export const STATIONS_QUERY_KEY = ["stations"] as const;

const SNAPSHOT_KEY = "stations_snapshot_v1";

interface Snapshot {
    stations: ChargerInfo[];
    updatedAt: number;
}

const readSnapshot = (): Snapshot | null => {
    try {
        const raw = localStorage.getItem(SNAPSHOT_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as Snapshot;
        if (!Array.isArray(parsed?.stations) || parsed.stations.length === 0) return null;

        return parsed;
    } catch {
        return null;
    }
};

/** 여러 컴포넌트가 같은 쿼리를 구독하므로, 저장은 한 번만 하도록 스냅샷 시각을 기억해 둔다 */
let persistedAt = 0;

const writeSnapshot = (snapshot: Snapshot) => {
    if (snapshot.updatedAt === persistedAt) return;
    persistedAt = snapshot.updatedAt;

    try {
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
    } catch {
        // 용량 초과·프라이빗 모드 등 — 캐시는 어디까지나 부가 기능이라 조용히 넘어간다
    }
};

/**
 * 서버 렌더 결과와 첫 클라이언트 렌더가 어긋나면 하이드레이션이 깨진다.
 * 캐시 주입은 하이드레이션 직후·페인트 직전에 끼워 넣어 스켈레톤 깜빡임을 없앤다.
 */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

const fetchStations = async (): Promise<ChargerInfo[]> => {
    const res = await fetch("/api/stations", { cache: "no-store" });
    if (!res.ok) throw new Error("충전 현황을 불러오지 못했습니다");

    return res.json();
};

/**
 * 충전 현황 구독.
 *
 * 직전에 본 현황을 로컬에 남겨 두고, 진입하면 그 데이터로 먼저 화면을 그린 뒤
 * 새 응답이 도착하면 갈아끼운다 — 탭을 옮길 때마다 스켈레톤을 다시 보지 않는다.
 */
export const useStations = () => {
    const queryClient = useQueryClient();

    useBeforePaint(() => {
        if (queryClient.getQueryData(STATIONS_QUERY_KEY)) return;

        const snapshot = readSnapshot();
        if (!snapshot) return;

        // 오래된 시각으로 넣어 두면 곧바로 stale 로 판정돼 새 데이터를 받아 온다
        queryClient.setQueryData<ChargerInfo[]>(STATIONS_QUERY_KEY, snapshot.stations, {
            updatedAt: snapshot.updatedAt,
        });
    }, [queryClient]);

    const query = useQuery({
        queryKey: STATIONS_QUERY_KEY,
        queryFn: fetchStations,
        refetchInterval: 5000,
        // 화면에 없을 때까지 5초마다 돌 이유는 없다 — 복귀 시 refetchOnWindowFocus 가 채워준다
        refetchIntervalInBackground: false,
    });

    const { data, dataUpdatedAt } = query;

    useEffect(() => {
        if (!data?.length) return;
        writeSnapshot({ stations: data, updatedAt: dataUpdatedAt });
    }, [data, dataUpdatedAt]);

    return query;
};
