"use client";

import { useToastStore } from "@/store/useToastStore";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Pinned action row from the mockup: 홈 화면에 추가 / 공유하기, sitting between
 * the scroll area and the tab bar.
 */
export const ActionBar = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const showToast = useToastStore((s) => s.show);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        const appInstalledHandler = () => setDeferredPrompt(null);

        window.addEventListener("beforeinstallprompt", handler);
        window.addEventListener("appinstalled", appInstalledHandler);
        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("appinstalled", appInstalledHandler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            showToast("iOS는 공유 버튼 > '홈 화면에 추가'를 이용해 주세요");
            return;
        }

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        showToast(
            outcome === "accepted"
                ? "홈 화면에 바로가기를 추가했습니다"
                : "홈 화면 추가를 취소했습니다"
        );
    };

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title: "다우디지털스퀘어 충전 현황", url });
                return;
            } catch (error) {
                // 사용자가 공유 시트를 닫은 경우 — 조용히 넘어간다
                if ((error as Error)?.name === "AbortError") return;
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            showToast("충전 현황 링크를 복사했습니다");
        } catch {
            showToast("링크를 복사하지 못했습니다");
        }
    };

    return (
        <div className="grid flex-none grid-cols-2 gap-[7px] px-3.5 pb-2 pt-1.5">
            <button
                onClick={handleInstall}
                className="flex h-11 items-center justify-center gap-1.5 rounded-[13px] bg-brand-500 text-[12.5px] font-bold tracking-[-0.3px] text-on-brand transition-colors hover:bg-brand-400 active:scale-[0.98]"
            >
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                    <rect x="1" y="1" width="13" height="13" rx="3.6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7.5 4.6v5.8M4.6 7.5h5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                홈 화면에 추가
            </button>

            <button
                onClick={handleShare}
                className="flex h-11 items-center justify-center gap-1.5 rounded-[13px] border border-line-strong bg-elevated text-[12.5px] font-semibold tracking-[-0.3px] text-foreground transition-colors hover:bg-elevated-hover active:scale-[0.98]"
            >
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                    <path d="M7.5 10.2V1.6M4.6 4.4L7.5 1.5l2.9 2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.4 8.6v3.4c0 .8.6 1.4 1.4 1.4h7.4c.8 0 1.4-.6 1.4-1.4V8.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                공유하기
            </button>
        </div>
    );
};
