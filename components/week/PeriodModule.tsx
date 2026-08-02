"use client";

import * as React from "react";
import {
  Droplets,
  ChevronLeft,
  ChevronRight,
  Bell,
  Scale,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addDays,
  daysBetween,
  formatMonthDay,
  parseISO,
  toISO,
  todayISO,
} from "@/lib/date";
import { cn } from "@/lib/utils";

const WEEK_LABELS = ["一", "二", "三", "四", "五", "六", "日"];

/** 生成某月的日历格子（周一开头，空白用 null 占位）。 */
function buildMonth(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // 周一 = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISO(new Date(year, month, d)));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function PeriodModule() {
  const periodDays = useStore((s) => s.periodDays);
  const periodCycle = useStore((s) => s.periodCycle);
  const periodDuration = useStore((s) => s.periodDuration);
  const weights = useStore((s) => s.weights);
  const targetWeight = useStore((s) => s.targetWeight);
  const togglePeriodDay = useStore((s) => s.togglePeriodDay);
  const setWeight = useStore((s) => s.setWeight);
  const setPeriodCycle = useStore((s) => s.setPeriodCycle);
  const setPeriodDuration = useStore((s) => s.setPeriodDuration);

  const today = todayISO();
  const now = parseISO(today);
  const [view, setView] = React.useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selected, setSelected] = React.useState<string>(today);

  const cells = buildMonth(view.year, view.month);

  const periodSet = React.useMemo(() => new Set(periodDays), [periodDays]);
  const latest = React.useMemo(
    () => (periodDays.length ? [...periodDays].sort().pop()! : null),
    [periodDays]
  );
  const next = latest ? addDays(latest, periodCycle) : null;
  const nextIn = next ? daysBetween(today, next) : Infinity;
  const selWeight = weights[selected];

  const shiftMonth = (delta: number) =>
    setView((v) => {
      const m = v.month + delta;
      const year = v.year + Math.floor(m / 12);
      const month = ((m % 12) + 12) % 12;
      return { year, month };
    });

  return (
    <div className="rounded-2xl border border-border bg-card p-4 soft-shadow">
      <div className="mb-3 flex items-center gap-2">
        <Droplets className="h-4 w-4 text-pink-500" />
        <h3 className="text-sm font-semibold">例假 &amp; 体重</h3>
        <span className="ml-auto text-[11px] text-muted-foreground">
          目标 {targetWeight != null ? `${targetWeight}kg` : "—"}
        </span>
      </div>

      {next && (
        <p className="mb-3 text-xs text-muted-foreground">
          预计下一次来潮：
          <span className="font-medium text-pink-600">{formatMonthDay(next)}</span>
          {nextIn <= 3 && nextIn >= 0 && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
              <Bell className="h-3 w-3" />
              {nextIn === 0 ? "今天" : `${nextIn} 天后`}提醒
            </span>
          )}
        </p>
      )}

      {/* 月份切换 */}
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => shiftMonth(-1)}
          className="rounded-md p-1 text-muted-foreground hover:bg-pink-50 hover:text-pink-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-medium">
          {view.year} 年 {view.month + 1} 月
        </span>
        <button
          onClick={() => shiftMonth(1)}
          className="rounded-md p-1 text-muted-foreground hover:bg-pink-50 hover:text-pink-600"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {WEEK_LABELS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) => {
          if (!iso) return <div key={`b${i}`} />;
          const inPeriod = periodSet.has(iso);
          const isToday = iso === today;
          const isSel = iso === selected;
          const w = weights[iso];
          return (
            <button
              key={iso}
              onClick={() => setSelected(iso)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md text-[11px] transition-colors",
                inPeriod
                  ? "bg-pink-200 font-semibold text-pink-700"
                  : "bg-pink-50/40 text-foreground/70 hover:bg-pink-100/60",
                isSel && "ring-2 ring-pink-400",
                isToday && "outline outline-1 outline-pink-300"
              )}
            >
              <span>{parseISO(iso).getDate()}</span>
              {w != null && (
                <span className="text-[9px] leading-none text-pink-500">{w}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 选中日期编辑区 */}
      <div className="mt-3 rounded-xl bg-pink-50/50 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground">
          <Scale className="h-3.5 w-3.5 text-pink-500" />
          {formatMonthDay(selected)}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-[11px] text-muted-foreground">
            体重 (kg)
            <Input
              type="number"
              step="0.1"
              value={selWeight ?? ""}
              onChange={(e) =>
                setWeight(
                  selected,
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className="mt-1 h-8 w-24"
              placeholder="记录体重"
            />
          </label>
          <Button
            size="xs"
            variant={periodSet.has(selected) ? "default" : "pinksoft"}
            onClick={() => togglePeriodDay(selected)}
          >
            <Droplets className="h-3 w-3" />
            {periodSet.has(selected) ? "取消例假" : "标记为例假"}
          </Button>
        </div>
      </div>

      {/* 周期 / 持续设置 */}
      <div className="mt-3 flex gap-2">
        <label className="block flex-1 text-[11px] text-muted-foreground">
          周期（天）
          <Input
            type="number"
            value={periodCycle}
            onChange={(e) => setPeriodCycle(Number(e.target.value) || 28)}
            className="mt-1 h-8"
          />
        </label>
        <label className="block flex-1 text-[11px] text-muted-foreground">
          持续（天）
          <Input
            type="number"
            value={periodDuration}
            onChange={(e) => setPeriodDuration(Number(e.target.value) || 6)}
            className="mt-1 h-8"
          />
        </label>
      </div>
    </div>
  );
}
