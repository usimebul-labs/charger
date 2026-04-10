"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // standalone 여부 확인
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

        const handler = (e: any) => {
            // 설치 프롬프트 이벤트 방지
            e.preventDefault();
            // 나중에 사용할 수 있도록 이벤트 저장
            setDeferredPrompt(e);

            // 이미 설치되어 있지 않은 경우에만 버튼 표시
            if (!isStandaloneMode) {
                // 약간의 지연 후 표시 (서비스 로딩 고려)
                const timer = setTimeout(() => setIsVisible(true), 2000);
                return () => clearTimeout(timer);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);

        // 앱이 이미 설치되었는지 확인하는 다른 방법 (appinstalled 이벤트)
        const appInstalledHandler = () => {
            setIsVisible(false);
            setDeferredPrompt(null);
        };
        window.addEventListener("appinstalled", appInstalledHandler);

        // 모바일 사파리나 다른 브라우저에서 beforeinstallprompt가 지원되지 않는 경우를 위해
        // standalone 모드인지만 한 번 더 명시적으로 체크
        if (isStandaloneMode) {
            setIsVisible(false);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("appinstalled", appInstalledHandler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // 설치 프롬프트 표시
        deferredPrompt.prompt();

        // 사용자의 선택 대기
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA 설치 선택 결과: ${outcome}`);

        // 프롬프트는 한 번만 사용 가능하므로 초기화
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-24 right-6 z-[60]"
            >
                <button
                    onClick={handleInstallClick}
                    className="group relative flex items-center justify-center p-3 bg-brand-500 text-background rounded-full shadow-[0_0_30px_-5px_var(--color-brand-500)] hover:scale-110 active:scale-95 transition-all duration-300 border border-brand-300/30 overflow-hidden dark:text-secondary-blue-dark-950"
                    aria-label="홈 화면에 추가"
                >
                    {/* Background Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                    <Plus className="w-5 h-5 stroke-[3px]" />

                    {/* Hover text label */}
                    <div className="absolute right-full mr-3 translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <div className="bg-card border border-brand-500/30 text-brand-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl dark:bg-secondary-blue-dark-900">
                            앱으로 설치하기
                        </div>
                    </div>
                </button>
            </motion.div>
        </AnimatePresence>
    );
};
