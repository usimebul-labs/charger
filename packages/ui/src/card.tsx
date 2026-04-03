import * as React from "react";
import { cn } from "@repo/utils";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): React.JSX.Element {
  return (
    <a
      className={cn(
        "group flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:bg-accent hover:text-accent-foreground",
        className
      )}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="p-6">
        <h3 className="font-semibold leading-none tracking-tight flex items-center space-x-2">
          <span>{title}</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">
            -&gt;
          </span>
        </h3>
        <div className="text-sm text-muted-foreground mt-2">{children}</div>
      </div>
    </a>
  );
}
