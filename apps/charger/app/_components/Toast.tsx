"use client";

import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

/**
 * Bottom-anchored toast from the mockup — sits above the action row and the
 * tab bar, so it never covers the controls that triggered it.
 *
 * 바텀 시트가 열려 있는 동안에는 시트에 가리지 않도록 상단으로 올라간다.
 * z-index 는 시트(z-50)보다 위여야 한다.
 */
export const Toast = () => {
  const message = useToastStore((s) => s.message);
  const anchor = useToastStore((s) => s.anchor);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute left-3.5 right-3.5 z-[60] animate-fade-in",
        anchor === "top" ? "top-[calc(env(safe-area-inset-top)+1rem)]" : "bottom-[152px]"
      )}
    >
      <div className="rounded-xl border border-line-strong bg-elevated/95 px-3.5 py-2.5 text-xs font-medium tracking-[-0.2px] text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {message}
      </div>
    </div>
  );
};
