"use client";

import * as React from "react";
import {
  TrendingUp,
  Flame,
  BookOpen,
  GraduationCap,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import type { Week } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { LineChart } from "@/components/common/LineChart";
import { todayISO, daysBetween } from "@/lib/date";

function Stat({
  icon: Icon,
  label,
  value,
  unit,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  unit?: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-2.5">
      <div className={`flex items-center gap-1 text-[11px] ${tone}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-foreground">
        {value}
        {unit && <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

export function GrowthStats({ week }: { week: Week }) {
  const days = week.days;

  let totalTodos = 0;
  let doneTodos = 0;
  let readingMinutes = 0;
  let workTasks = 0;
  let studyMaterials = 0;

  const daily = days.map((d, i) => {
    const t = d.todos.length;
    const done = d.todos.filter((x) => x.done).length;
    totalTodos += t;
    doneTodos += done;
    readingMinutes += d.reading.reduce((s, r) => s + r.minutes, 0);
    workTasks += d.work.filter((w) => w.done).length;
    studyMaterials +=
      (d.vocab.text.trim() ? 1 : 0) +
      (d.grammar.text.trim() ? 1 : 0) +
      d.vocab.images.length +
      d.grammar.images.length;
    const pct = t ? Math.round((done / t) * 100) : 0;
    return { label: ["一", "二", "三", "四", "五", "六", "日"][i], value: pct };
  });

  const completion = totalTodos ? Math.round((doneTodos / totalTodos) * 100) : 0;

  // consecutive check-in days (at least one todo done), counting back from today
  let streak = 0;
  const today = todayISO();
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (d.date > today) break; // future days don't count
    if (d.todos.some((x) => x.done)) streak++;
    else break;
  }
  // if week is fully in the past, count its tail
  if (days[days.length - 1].date < today) {
    streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].todos.some((x) => x.done)) streak++;
      else break;
    }
  }

  const workMinutes = workTasks * 30; // estimate 30 min per completed task

  return (
    <div className="rounded-2xl border border-border bg-card p-4 soft-shadow">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-pink-500" />
        <h3 className="text-sm font-semibold">成长统计</h3>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">本周任务完成率</span>
          <span className="font-medium text-pink-600">{completion}%</span>
        </div>
        <Progress value={completion} />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat icon={Flame} label="连续打卡" value={streak} unit="天" tone="text-orange-500" />
        <Stat icon={BookOpen} label="阅读时长" value={readingMinutes} unit="分" tone="text-sky-500" />
        <Stat icon={GraduationCap} label="学习素材" value={studyMaterials} unit="项" tone="text-violet-500" />
        <Stat icon={Briefcase} label="工作时长" value={workMinutes} unit="分" tone="text-amber-500" />
        <Stat icon={CheckCircle2} label="完成任务" value={`${doneTodos}/${totalTodos}`} tone="text-pink-500" />
      </div>

      <div className="rounded-xl border border-border bg-pink-50/40 p-2">
        <div className="mb-1 px-1 text-[11px] text-muted-foreground">每日完成率</div>
        <LineChart data={daily} unit="%" />
      </div>
    </div>
  );
}
