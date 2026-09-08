"use client";

import { useToastStore } from "@/store/useToastStore";

/**
 * Bottom-anchored toast from the mockup — sits above the action row and the
 * tab bar, so it never covers the controls that triggered it.
 */
export const Toast = () => {
  const message = useToastStore((s) => s.message);

  if (!message) return null;

  return (
    <div className="pointer-events-none absolute left-3.5 right-3.5 bottom-[152px] z-30 animate-fade-in">
      <div className="rounded-xl border border-line-strong bg-elevated/95 px-3.5 py-2.5 text-xs font-medium tracking-[-0.2px] text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {message}
      </div>
    </div>
  );
};
