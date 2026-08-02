"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { quoteForDate } from "@/lib/quotes";
import { formatMonthDay, weekdayName, todayISO } from "@/lib/date";
import { Backup } from "@/components/common/Backup";

export function DesktopWidget() {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const quote = quoteForDate(todayISO());

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-4 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">
              Personal Growth
            </div>
            <div className="text-[10px] text-muted-foreground">个人成长工作台</div>
          </div>
        </div>

        <div className="hidden items-baseline gap-2 sm:flex">
          <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
            {now
              ? now.toLocaleTimeString("zh-CN", { hour12: false })
              : "--:--:--"}
          </span>
          <span className="text-xs text-muted-foreground">
            {now
              ? `${formatMonthDay(
                  now.toISOString().slice(0, 10)
                )} ${weekdayName(now.toISOString().slice(0, 10))}`
              : ""}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Backup />
          <div className="text-right">
            <div className="text-sm font-medium text-foreground/90">
              {quote.zh}
            </div>
            <div className="text-[11px] italic text-muted-foreground">
              {quote.en}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
