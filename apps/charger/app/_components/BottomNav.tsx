"use client";

import { cn } from "@/lib/utils";
import { BarChart2, Home, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "홈",
    href: "/",
    icon: Home,
  },
  {
    name: "통계/분석",
    href: "/statistics",
    icon: BarChart2,
  },
  {
    name: "충전 팁",
    href: "/tips",
    icon: Lightbulb,
  },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="relative z-20 grid flex-none grid-cols-3 border-t border-border bg-background/98 px-1.5 backdrop-blur-md">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            aria-current={isActive ? "page" : undefined}
            /*
             * 탭 영역은 손가락 기준 최소 48px, 그리고 홈 인디케이터 영역(safe-area)까지
             * Link 안쪽 패딩으로 끌어와 하단 끝까지 눌리도록 한다.
             */
            className={cn(
              "flex min-h-12 touch-manipulation select-none flex-col items-center justify-center gap-[3px] rounded-xl pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 transition-colors",
              "active:bg-foreground/8",
              isActive ? "text-brand-500" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "stroke-[2.4px]")} />
            <span className="text-[10px] font-semibold tracking-[-0.2px]">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
