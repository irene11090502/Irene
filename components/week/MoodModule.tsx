"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import type { MoodType } from "@/lib/types";
import { cn } from "@/lib/utils";

const MOODS: { type: MoodType; emoji: string; label: string }[] = [
  { type: "happy", emoji: "😀", label: "开心" },
  { type: "calm", emoji: "🙂", label: "平静" },
  { type: "sad", emoji: "😔", label: "难过" },
  { type: "angry", emoji: "😡", label: "生气" },
  { type: "tired", emoji: "😴", label: "疲惫" },
];

export function MoodModule({ weekId, day }: { weekId: string; day: any }) {
  const setMood = useStore((s) => s.setMood);
  const clearMood = useStore((s) => s.clearMood);

  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-1">
        {MOODS.map((m) => (
          <button
            key={m.type}
            onClick={() =>
              setMood(
                weekId,
                day.date,
                m.type,
                day.mood?.type === m.type ? day.mood?.note : ""
              )
            }
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg border py-1.5 transition-all",
              day.mood?.type === m.type
                ? "border-pink-300 bg-pink-100"
                : "border-border bg-white hover:bg-accent/50"
            )}
          >
            <span className="text-lg leading-none">{m.emoji}</span>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
          </button>
        ))}
      </div>
      {day.mood && (
        <div className="flex gap-1.5">
          <input
            defaultValue={day.mood.note ?? ""}
            placeholder="备注一下心情…"
            onBlur={(e) => setMood(weekId, day.date, day.mood.type, e.target.value)}
            className="h-8 flex-1 rounded-xl border border-input bg-card px-3 text-xs outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            onClick={() => clearMood(weekId, day.date)}
            className="rounded-xl px-2 text-xs text-muted-foreground hover:bg-accent"
          >
            清除
          </button>
        </div>
      )}
    </div>
  );
}
