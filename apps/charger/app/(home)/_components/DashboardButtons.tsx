"use client"

import { useStationStore } from "@/store/useStationStore";
import { useStations } from "../_hooks/useStations";
import { registerWaitings } from "@/app/actions/charger";
import { useEffect, useMemo, useState } from "react";
import { isAvailable, urlBase64ToUint8Array } from "../_utils/charger";
import { motion, AnimatePresence } from "framer-motion";

export const DashboardButtons = () => {
    const { showOnlyAvailable, toggleShowOnlyAvailable } = useStationStore();
    const { data: stations } = useStations();
    const [isSupported, setIsSupported] = useState(false);
    const [isPWA, setIsPWA] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [tooltip, setTooltip] = useState<{ visible: boolean; message: string; type: "02" | "06" | null }>({
        visible: false,
        message: "",
        type: null
    });


    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));
        setIsPWA(window.matchMedia('(display-mode: standalone)').matches);

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            registerServiceWorker();
        }
    }, []);

    const registerServiceWorker = async () => {
        try {
            await navigator.serviceWorker.register('/sw.js');
        } catch (error) {
            console.error('Service Worker 등록 실패:', error);
        }
    };

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

    const showTooltipMessage = (type: "02" | "06") => {
        const typeName = type === "06" ? "급속" : "완속";
        setTooltip({
            visible: true,
            message: `"${typeName}" 충전 스테이션이 모두\n'충전 중'일 때만 알림 등록이 가능합니다`,
            type
        });
        setTimeout(() => setTooltip(prev => ({ ...prev, visible: false })), 3000);
    };

    const handleRegisterNotification = async (type: "02" | "06") => {
        if (!isSupported) {
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

            await registerWaitings(subscription.toJSON(), type);
            alert("알림 신청이 완료되었습니다.");
        } catch (error) {
            console.error("Failed to register notification:", error);
            alert("알림 신청에 실패했습니다.");
        }
    };



    return (
        <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-2">
                <div className="relative">
                    <button
                        onClick={() => {
                            if (!hasFastCharger || availableFastCount > 0) {
                                showTooltipMessage("06");
                            } else {
                                handleRegisterNotification("06");
                            }
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border
                            ${hasFastCharger && availableFastCount === 0
                                ? "bg-warning-500/10 text-warning-500 border-warning-500/30 shadow-[0_0_20px_-5px_rgba(249,162,7,0.2)] active:scale-95"
                                : "bg-gray-800/20 text-gray-100/40 border-gray-600/30"
                            }`}
                    >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        급속 충전 알림
                    </button>

                    <AnimatePresence>
                        {tooltip.visible && tooltip.type === "06" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full left-0 mb-3 z-50"
                            >
                                <div className="bg-gray-900/95 border border-warning-500/30 text-warning-200 text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 whitespace-pre-line min-w-[220px]">
                                    <svg className="w-3.5 h-3.5 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {tooltip.message}
                                    <div className="absolute top-full left-6 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-warning-500/30"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative">
                    <button
                        onClick={() => {
                            if (!hasSlowCharger || availableSlowCount > 0) {
                                showTooltipMessage("02");
                            } else {
                                handleRegisterNotification("02");
                            }
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border
                            ${hasSlowCharger && availableSlowCount === 0
                                ? "bg-secondary-blue-500/10 text-secondary-blue-500 border-secondary-blue-500/30 shadow-[0_0_20px_-5px_rgba(71,84,255,0.2)] active:scale-95"
                                : "bg-gray-800/20 text-gray-100/40 border-gray-600/30"
                            }`}
                    >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" />
                        </svg>
                        완속 충전 알림
                    </button>

                    <AnimatePresence>
                        {tooltip.visible && tooltip.type === "02" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full left-0 mb-3 z-50"
                            >
                                <div className="bg-gray-900/95 border border-secondary-blue-500/30 text-secondary-blue-200 text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 whitespace-pre-line min-w-[220px]">
                                    <svg className="w-3.5 h-3.5 text-secondary-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {tooltip.message}
                                    <div className="absolute top-full left-6 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-secondary-blue-500/30"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <button
                onClick={toggleShowOnlyAvailable}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${showOnlyAvailable
                    ? "bg-success-500/10 text-success-400 border-success-500/30 shadow-[0_0_20px_-5px_rgba(0,242,38,0.2)]"
                    : "bg-gray-800/50 text-gray-300 border-gray-800 hover:border-gray-700"
                    }`}
            >
                <div className={`relative flex items-center justify-center w-3 h-3`}>
                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${showOnlyAvailable ? "border-success-400" : "border-gray-400"}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${showOnlyAvailable ? "bg-success-400 scale-100 animate-pulse" : "bg-transparent scale-0"}`}></div>
                </div>
                충전 가능
            </button>
        </div>
    );
};

