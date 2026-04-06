"use client"

import { useStationStore } from "@/store/useStationStore";
import { useStations } from "../_hooks/useStations";
import { registerWaitings } from "@/app/actions/charger";
import { useMemo } from "react";
import { isAvailable } from "../_utils/charger";

export const DashboardButtons = () => {
    const { showOnlyAvailable, toggleShowOnlyAvailable } = useStationStore();
    const { data: stations } = useStations();

    const availableFastCount = useMemo(() =>
        stations?.filter((s) => s.type.code === "06" && isAvailable(s.status.code)).length || 0
        , [stations]);

    const availableSlowCount = useMemo(() =>
        stations?.filter((s) => s.type.code === "02" && isAvailable(s.status.code)).length || 0
        , [stations]);

    const hasFastCharger = useMemo(() =>
        stations?.some((s) => s.type.code === "06") || false
        , [stations]);

    const hasSlowCharger = useMemo(() =>
        stations?.some((s) => s.type.code === "02") || false
        , [stations]);

    const handleRegisterNotification = async (type: "02" | "06") => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            alert("이 브라우저는 알림을 지원하지 않습니다.");
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                alert("알림 권한이 거부되었습니다.");
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!publicVapidKey) {
                    console.error("VAPID public key is missing");
                    return;
                }

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                });
            }

            await registerWaitings(subscription as any, type);
            alert("알림 신청이 완료되었습니다.");
        } catch (error) {
            console.error("Failed to register notification:", error);
            alert("알림 신청에 실패했습니다.");
        }
    };

    function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    return (
        <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-2">
                <button
                    onClick={() => handleRegisterNotification("06")}
                    disabled={!hasFastCharger || availableFastCount > 0}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border
                        ${hasFastCharger && availableFastCount === 0
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)] active:scale-95"
                            : "bg-slate-800/20 text-slate-300 border-slate-600/50 cursor-not-allowed opacity-50"
                        }`}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    급속 충전 알림
                </button>

                <button
                    onClick={() => handleRegisterNotification("02")}
                    // disabled={!hasSlowCharger || availableSlowCount > 0}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border
                        ${hasSlowCharger && availableSlowCount === 0
                            ? "bg-sky-500/10 text-sky-500 border-sky-500/30 shadow-[0_0_20px_-5px_rgba(14,165,233,0.2)] active:scale-95"
                            : "bg-slate-800/20 text-slate-300 border-slate-600/50 cursor-not-allowed opacity-50"
                        }`}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" />
                    </svg>
                    완속 충전 알림
                </button>
            </div>

            <button
                onClick={toggleShowOnlyAvailable}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${showOnlyAvailable
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]"
                    : "bg-slate-800/50 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
            >
                <div className={`relative flex items-center justify-center w-3 h-3`}>
                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${showOnlyAvailable ? "border-emerald-400" : "border-slate-400"}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${showOnlyAvailable ? "bg-emerald-400 scale-100 animate-pulse" : "bg-transparent scale-0"}`}></div>
                </div>
                충전 가능
            </button>
        </div>
    );
};

