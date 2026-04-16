"use client";

import { useEffect, useState } from "react";
import { Plus, Share2, MonitorSmartphone, Copy, Check, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        const appInstalledHandler = () => {
            setDeferredPrompt(null);
        };

        window.addEventListener("appinstalled", appInstalledHandler);
        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("appinstalled", appInstalledHandler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            alert("이미 설치되어 있거나 추가를 지원하지 않는 환경입니다.\n(iOS Safari는 공유 버튼 > '홈 화면에 추가'를 이용해주세요)");
            return;
        }
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setIsExpanded(false);
    };

    const handleShareClick = () => {
        setIsShareModalOpen(true);
        setIsExpanded(false);
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy URL");
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "DAOU DIGITAL SQUARE Charger Dashboard",
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Failed to share", error);
            }
        } else {
            handleCopyUrl();
            alert("이 브라우저에서는 고유 공유 기능을 지원하지 않아 URL이 복사되었습니다.");
        }
    };

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="absolute bottom-24 right-6 z-[60]"
                >
                    <motion.div
                        className="flex items-center bg-brand-500 rounded-full shadow-[0_0_30px_-5px_var(--color-brand-500)] border border-brand-300/30 overflow-hidden text-background dark:text-secondary-blue-dark-950 h-12"
                        initial={false}
                        animate={{
                            width: isExpanded ? "auto" : "48px",
                            paddingLeft: isExpanded ? "12px" : "0px",
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-1 overflow-hidden whitespace-nowrap pr-1"
                                >
                                    <button
                                        onClick={handleShareClick}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/20 transition-colors shrink-0 outline-none"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span className="text-sm font-bold">공유하기</span>
                                    </button>
                                    <button
                                        onClick={handleInstallClick}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/20 transition-colors shrink-0 outline-none"
                                    >
                                        <MonitorSmartphone className="w-4 h-4" />
                                        <span className="text-sm font-bold">홈 화면에 추가</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Toggle Button */}
                        <div className="flex-1 flex justify-end shrink-0">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors shrink-0 outline-none"
                                aria-label={isExpanded ? "메뉴 닫기" : "메뉴 열기"}
                            >
                                <motion.div
                                    animate={{ rotate: isExpanded ? 45 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-center w-full h-full"
                                >
                                    <Plus className="w-6 h-6 stroke-[2.5px]" />
                                </motion.div>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Share Dialog */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsShareModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
                        >
                            <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                                공유하기
                            </h3>

                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">현재 주소</span>
                                <div className="bg-muted/50 p-3 rounded-xl text-sm text-foreground break-all border border-border/50 select-all">
                                    {typeof window !== "undefined" ? window.location.href : ""}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <button
                                    onClick={handleCopyUrl}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 outline-none"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                    <span>{copied ? "복사완료" : "주소 복사"}</span>
                                </button>
                                <button
                                    onClick={handleNativeShare}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all bg-brand-500 text-white hover:bg-brand-600 active:scale-95 shadow-md shadow-brand-500/20 outline-none"
                                >
                                    <Share className="w-5 h-5" />
                                    <span>공유하기</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
