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
    <nav className="relative z-20 grid flex-none grid-cols-3 border-t border-border bg-background/98 px-1.5 pt-[5px] backdrop-blur-md pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-[3px] pb-0.5 pt-[5px] transition-colors",
              isActive ? "text-brand-500" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive && "stroke-[2.4px]")} />
            <span className="text-[10px] font-semibold tracking-[-0.2px]">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
