

export function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const isStandalone = () => {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        document.referrer.includes('android-app://')
    );
};

export const isAvailable = (statusCode: string) => {
    return ["2", "8", "9"].includes(statusCode);
};

export const CHARGER_TYPES = {
    RAPID: "06",
    SLOW: "02"
} as const;

/**
 * The mockup collapses every charger status into three colours:
 * 대기(green) / 충전중(blue) / 완료·케이블(orange). Anything the station
 * reports outside those — 점검 중, 통신 이상 — falls through to `off`.
 */
export type ChargerState = "free" | "busy" | "done" | "off";

export const getChargerState = (statusCode: string): ChargerState => {
    if (statusCode === "2") return "free";
    if (statusCode === "1" || statusCode === "6") return "busy";
    if (statusCode === "8" || statusCode === "9") return "done";
    return "off";
};

interface StateMeta {
    label: string;
    /** Tailwind text colour keyed to the state tokens in globals.css */
    text: string;
    /** Solid background — used for the stall post and legend swatches */
    bg: string;
    /** Border colour for the stall outline */
    border: string;
    /** Tinted fill behind an available stall */
    fill: string;
    hint: string;
}

export const STATE_META: Record<ChargerState, StateMeta> = {
    free: {
        label: "충전대기",
        text: "text-free",
        bg: "bg-free",
        border: "border-free/45",
        fill: "bg-free/8",
        hint: "지금 바로 충전을 시작할 수 있습니다.",
    },
    busy: {
        label: "충전중",
        text: "text-busy",
        bg: "bg-busy",
        border: "border-busy/40",
        fill: "bg-busy/5",
        hint: "충전이 끝나면 알림을 보내드립니다.",
    },
    done: {
        label: "완료·케이블",
        text: "text-done",
        bg: "bg-done",
        border: "border-done/40",
        fill: "bg-done/5",
        hint: "충전은 끝났지만 케이블이 연결된 상태입니다.",
    },
    off: {
        label: "점검 중",
        text: "text-off",
        bg: "bg-off",
        border: "border-off/35",
        fill: "bg-off/5",
        hint: "현재 이용할 수 없는 충전기입니다.",
    },
};

/** `84` → `1시간 24분` */
export const formatDuration = (minutes: number) =>
    minutes >= 60 ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}분` : `${minutes}분`;

/** `84` → `1:24` — the compact form used inside a stall */
export const formatShortDuration = (minutes: number) =>
    minutes >= 60
        ? `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`
        : `${minutes}분`;

export const minutesSince = (iso?: string) => {
    if (!iso) return null;
    const started = new Date(iso).getTime();
    if (Number.isNaN(started)) return null;
    return Math.floor(Math.max(0, Date.now() - started) / 60000);
};
