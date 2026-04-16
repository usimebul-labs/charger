"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <nav className="absolute bottom-0 left-0 right-0 z-50 h-[68px] bg-background/80 backdrop-blur-md border-t border-border/10 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
              isActive
                ? "text-brand-500"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
            <span className={cn("text-[10px] tracking-wide", isActive ? "font-bold" : "font-medium")}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
