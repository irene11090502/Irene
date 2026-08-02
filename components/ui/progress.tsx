import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  indicatorClassName,
}: {
  value: number; // 0-100
  className?: string;
  indicatorClassName?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-pink-100",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-500",
          indicatorClassName
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
