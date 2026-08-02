"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { DesktopWidget } from "@/components/layout/DesktopWidget";
import { Sidebar } from "@/components/layout/Sidebar";
import { WeekView } from "@/components/layout/WeekView";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { startOfWeekMonday, todayISO } from "@/lib/date";

export default function Page() {
  const hasHydrated = useStore((s) => s._hasHydrated);
  const weeks = useStore((s) => s.weeks);
  const selectedWeekId = useStore((s) => s.selectedWeekId);
  const createWeek = useStore((s) => s.createWeek);

  React.useEffect(() => {
    if (!hasHydrated) {
      useStore.persist.rehydrate();
    }
  }, [hasHydrated]);

  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        正在加载工作台…
      </div>
    );
  }

  const week =
    weeks.find((w) => w.id === selectedWeekId) ?? weeks[0] ?? null;

  return (
    <div className="flex h-screen flex-col bg-background">
      <DesktopWidget />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {week ? (
            <WeekView week={week} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-muted-foreground">
                还没有周计划，创建你的第一周吧 ✨
              </p>
              <Button
                onClick={() => createWeek(startOfWeekMonday(todayISO()))}
              >
                <CalendarPlus className="mr-1.5 h-4 w-4" />
                新建周计划
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
