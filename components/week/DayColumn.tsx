"use client";

import * as React from "react";
import {
  CheckSquare,
  GraduationCap,
  BookOpen,
  Briefcase,
  Smile,
  BookText,
} from "lucide-react";
import type { DayData } from "@/lib/types";
import { formatMonthDay, weekdayName, todayISO, isSameDay } from "@/lib/date";
import { useStore } from "@/lib/store";
import { Section } from "@/components/common/Section";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TodoList } from "./TodoList";
import { StudyModule } from "./StudyModule";
import { ReadingModule } from "./ReadingModule";
import { WorkModule } from "./WorkModule";
import { MoodModule } from "./MoodModule";
import { DiaryModule } from "./DiaryModule";

export function DayColumn({ weekId, day }: { weekId: string; day: DayData }) {
  const isToday = isSameDay(day.date, todayISO());

  const weight = useStore((s) => s.weights[day.date]);
  const targetWeight = useStore((s) => s.targetWeight);
  const setWeight = useStore((s) => s.setWeight);
  const setTargetWeight = useStore((s) => s.setTargetWeight);

  const onWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setWeight(day.date, v === "" ? null : Number(v));
  };
  const onTarget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTargetWeight(v === "" ? null : Number(v));
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-3 soft-shadow",
        isToday ? "border-pink-300 ring-1 ring-pink-200" : "border-border"
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* 日期条：窄屏在顶部，宽屏在左侧；下方含目标体重 / 体重 */}
        <div className="flex items-start justify-between gap-2 lg:w-36 lg:shrink-0 lg:flex-col lg:items-stretch lg:border-r lg:border-border lg:pr-3">
          <div className="flex items-center gap-2">
            <div>
              <div className="text-base font-semibold text-foreground">
                {weekdayName(day.date)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatMonthDay(day.date)}
              </div>
            </div>
            {isToday && (
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-pink-700">
                今天
              </span>
            )}
          </div>

          <div className="mt-2 w-full space-y-1">
            <div className="flex items-center gap-1">
              <span className="w-7 shrink-0 text-[10px] text-muted-foreground">
                目标
              </span>
              <Input
                type="number"
                step="0.1"
                value={targetWeight ?? ""}
                onChange={onTarget}
                placeholder="—"
                className="h-6 w-14 rounded-md px-1.5 py-0 text-[11px]"
              />
              <span className="text-[10px] text-muted-foreground">kg</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-7 shrink-0 text-[10px] text-muted-foreground">
                体重
              </span>
              <Input
                type="number"
                step="0.1"
                value={weight ?? ""}
                onChange={onWeight}
                placeholder="—"
                className="h-6 w-14 rounded-md px-1.5 py-0 text-[11px]"
              />
              <span className="text-[10px] text-muted-foreground">kg</span>
            </div>
          </div>
        </div>

        {/* 模块区：横向并排，按需换行 */}
        <div className="grid flex-1 grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <Section icon={CheckSquare} title="待办" accent="text-pink-500">
            <TodoList weekId={weekId} day={day} />
          </Section>

          <Section icon={GraduationCap} title="学习" defaultOpen={false} accent="text-violet-500">
            <StudyModule weekId={weekId} day={day} />
          </Section>

          <Section icon={BookOpen} title="阅读" defaultOpen={false} accent="text-sky-500">
            <ReadingModule weekId={weekId} day={day} />
          </Section>

          <Section icon={Briefcase} title="工作" defaultOpen={false} accent="text-amber-500">
            <WorkModule weekId={weekId} day={day} />
          </Section>

          <Section icon={Smile} title="情绪" defaultOpen={false} accent="text-orange-500">
            <MoodModule weekId={weekId} day={day} />
          </Section>

          <Section icon={BookText} title="日记" defaultOpen={false} accent="text-rose-500">
            <DiaryModule weekId={weekId} day={day} />
          </Section>
        </div>
      </div>
    </div>
  );
}
