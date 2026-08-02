"use client";

import * as React from "react";
import type { Week } from "@/lib/types";
import { WeeklyGoals } from "@/components/week/WeeklyGoals";
import { DayColumn } from "@/components/week/DayColumn";
import { GrowthStats } from "@/components/stats/GrowthStats";
import { PeriodModule } from "@/components/week/PeriodModule";

export function WeekView({ week }: { week: Week }) {
  return (
    <div className="space-y-4 px-5 py-5">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold text-foreground">{week.name}</h1>
        <span className="text-sm text-muted-foreground">{week.label}</span>
      </div>

      <WeeklyGoals weekId={week.id} goals={week.goals} />

      {/* 每天一条全宽横排，竖向堆叠 */}
      <div className="space-y-3">
        {week.days.map((day) => (
          <DayColumn key={day.date} weekId={week.id} day={day} />
        ))}
      </div>

      {/* 统计与例假记录：整宽底部区 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GrowthStats week={week} />
        <PeriodModule />
      </div>
    </div>
  );
}
