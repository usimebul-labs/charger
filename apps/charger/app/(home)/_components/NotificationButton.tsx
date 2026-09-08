"use client";

import { registerWaitings } from "@/app/actions/charger";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStations } from "../_hooks/useStations";
import { CHARGER_TYPES, isAvailable, urlBase64ToUint8Array } from "../_utils/charger";

type ChargerTypeCode = "02" | "06";

const BoltIcon = () => (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const PlugIcon = () => (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" />
    </svg>
);

/**
 * 헤더의 알림 버튼 — 누르면 급속/완속 중 어느 쪽 알림을 받을지 고르는 다이얼로그를 띄운다.
 * 해당 종류에 충전 가능한 충전기가 남아 있으면 신청할 이유가 없으므로 비활성화한다.
 */
export const NotificationButton = () => {
    const { data: stations } = useStations();
    const showToast = useToastStore((s) => s.show);
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [pendingType, setPendingType] = useState<ChargerTypeCode | null>(null);

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            navigator.serviceWorker
                .register("/sw.js")
                .catch((error) => console.error("Service Worker 등록 실패:", error));
        }
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 220);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, handleClose]);

    const options = useMemo(() => {
        const build = (type: ChargerTypeCode, label: string, icon: React.ReactNode, tone: string) => {
            const ofType = stations?.filter((s) => s.type.code === type) ?? [];
            const available = ofType.filter((s) => isAvailable(s.status.code)).length;

            return {
                type,
                label,
                icon,
                tone,
                total: ofType.length,
                available,
                // 지금 바로 쓸 수 있는 자리가 있으면 알림을 신청할 이유가 없다
                armed: ofType.length > 0 && available === 0,
            };
        };

        return [
            build(CHARGER_TYPES.RAPID, "급속", <BoltIcon />, "border-done/40 bg-done/10 text-done"),
            build(CHARGER_TYPES.SLOW, "완속", <PlugIcon />, "border-busy/40 bg-busy/10 text-busy"),
        ];
    }, [stations]);

    const registerNotification = async (type: ChargerTypeCode) => {
        if (!isSupported) {
            showToast("이 브라우저는 알림을 지원하지 않습니다");
            return;
        }

        setPendingType(type);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                showToast("알림 권한이 거부되었습니다");
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!publicVapidKey) {
                    console.error("VAPID public key is missing");
                    showToast("알림 설정이 준비되지 않았습니다");
                    return;
                }

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                });
            }

            await registerWaitings(subscription.toJSON(), type);
            showToast(`${type === CHARGER_TYPES.RAPID ? "급속" : "완속"} 충전 알림을 신청했습니다`);
            handleClose();
        } catch (error) {
            console.error("Failed to register notification:", error);
            showToast("알림 신청에 실패했습니다");
        } finally {
            setPendingType(null);
        }
    };

    const handleSelect = (option: (typeof options)[number]) => {
        if (pendingType) return;

        if (option.total === 0) {
            showToast(`${option.label} 충전기 정보가 없습니다`);
            return;
        }

        if (!option.armed) {
            showToast(`"${option.label}" 충전 스테이션이 모두 '충전 중'일 때만 알림 등록이 가능합니다`);
            return;
        }

        registerNotification(option.type);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                aria-label="충전 완료 알림 신청"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-line-strong bg-elevated text-foreground transition-colors hover:bg-elevated-hover active:scale-95"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M8 1.8a4 4 0 0 0-4 4v2.7L2.9 11h10.2L12 8.5V5.8a4 4 0 0 0-4-4Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M6.4 13a1.7 1.7 0 0 0 3.2 0"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-center">
                    <div className="relative flex w-full max-w-[480px] flex-col justify-end">
                        <div
                            onClick={handleClose}
                            className={cn(
                                "scrim absolute inset-0 transition-opacity duration-200",
                                isClosing ? "opacity-0" : "animate-fade-in opacity-100"
                            )}
                        />

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label="충전 완료 알림 신청"
                            className={cn(
                                "relative rounded-t-[20px] border-t border-line-strong bg-surface px-[18px] pb-5 pt-2 shadow-[0_-12px_40px_rgba(0,0,0,0.45)]",
                                isClosing ? "translate-y-full transition-transform duration-200" : "animate-sheet-up"
                            )}
                        >
                            <div className="mx-auto mb-3.5 h-1 w-9 rounded-sm bg-foreground/16" />

                            <h2 className="text-[17px] font-extrabold tracking-[-0.5px] text-foreground">
                                충전 완료 알림
                            </h2>
                            <p className="mt-[3px] text-[11.5px] leading-[1.5] text-muted-foreground">
                                알림 받을 충전기 종류를 선택해 주세요. 자리가 나면 바로 알려드립니다.
                            </p>

                            <div className="my-3.5 flex flex-col gap-[7px]">
                                {options.map((option) => (
                                    <button
                                        key={option.type}
                                        onClick={() => handleSelect(option)}
                                        aria-disabled={!option.armed}
                                        className={cn(
                                            "flex items-center gap-2.5 rounded-[13px] border px-3.5 py-3 text-left transition-colors active:scale-[0.99]",
                                            option.armed
                                                ? option.tone
                                                : "border-border bg-elevated text-muted-foreground opacity-60"
                                        )}
                                    >
                                        {option.icon}
                                        <span className="flex-1 text-[13.5px] font-bold tracking-[-0.3px]">
                                            {option.label} 충전 알림
                                        </span>
                                        <span className="tabular text-[11px] font-semibold">
                                            {pendingType === option.type
                                                ? "신청 중..."
                                                : option.total === 0
                                                    ? "정보 없음"
                                                    : option.armed
                                                        ? "신청 가능"
                                                        : `대기 ${option.available}대`}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleClose}
                                className="h-[46px] w-full rounded-[13px] border border-line-strong bg-elevated text-[13.5px] font-bold tracking-[-0.3px] text-foreground transition-colors hover:bg-elevated-hover active:scale-[0.99]"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
