import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { tone?: "pink" | "gray" | "green" | "amber" | "red" }
>(({ className, tone = "gray", ...props }, ref) => {
  const tones: Record<string, string> = {
    pink: "bg-pink-100 text-pink-700",
    gray: "bg-muted text-muted-foreground",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
