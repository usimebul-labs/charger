"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show splash for 1.8 seconds, then start fade out
    const splashTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    // After fade out (700ms), complete the splash
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-secondary-blue-dark-950 transition-all duration-700 ease-in-out font-[family-name:var(--font-daki)]",
        isFadingOut ? "opacity-0 pointer-events-none scale-110" : "opacity-100"
      )}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

      <div
        className={cn(
          "relative flex flex-col items-center transition-all duration-1000 delay-100",
          isFadingOut ? "translate-y-[-20px] blur-sm" : "translate-y-0"
        )}
      >
        {/* Logo */}
        <div className="relative w-56 h-16 sm:w-72 sm:h-16 animate-in fade-in zoom-in-95 duration-1000">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text content */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            <span className="text-brand-500 drop-shadow-[0_0_15px_rgba(0,244,112,0.3)]">
              DAOU DIGITAL SQUARE
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-medium tracking-widest uppercase">
            전기차 충전 스테이션 현황
          </p>
        </div>
      </div>
    </div>
  );
};
