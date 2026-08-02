"use client";

import * as React from "react";
import { Target, Check, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function WeeklyGoals({ weekId, goals }: { weekId: string; goals: any[] }) {
  const addGoal = useStore((s) => s.addGoal);
  const toggleGoal = useStore((s) => s.toggleGoal);
  const editGoal = useStore((s) => s.editGoal);
  const deleteGoal = useStore((s) => s.deleteGoal);

  const [text, setText] = React.useState("");
  const done = goals.filter((g) => g.done).length;
  const pct = goals.length ? Math.round((done / goals.length) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 soft-shadow">
      <div className="mb-2 flex items-center gap-2">
        <Target className="h-4 w-4 text-pink-500" />
        <h3 className="text-sm font-semibold">本周目标</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {done}/{goals.length} · {pct}%
        </span>
      </div>
      <Progress value={pct} className="mb-3" />
      <div className="flex flex-wrap gap-2">
        {goals.map((g) => (
          <div
            key={g.id}
            className="group flex items-center gap-1.5 rounded-full border border-border bg-white py-1 pl-1.5 pr-2"
          >
            <button
              onClick={() => toggleGoal(weekId, g.id)}
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full border",
                g.done
                  ? "border-pink-500 bg-pink-500 text-white"
                  : "border-muted-foreground/40"
              )}
            >
              {g.done && <Check className="h-2.5 w-2.5" />}
            </button>
            <input
              defaultValue={g.text}
              onBlur={(e) => editGoal(weekId, g.id, e.target.value.trim() || g.text)}
              className={cn(
                "w-auto bg-transparent text-xs outline-none",
                g.done && "text-muted-foreground line-through"
              )}
            />
            <button
              onClick={() => deleteGoal(weekId, g.id)}
              className="hidden text-muted-foreground hover:text-rose-500 group-hover:block"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) {
                addGoal(weekId, text.trim());
                setText("");
              }
            }}
            placeholder="+ 添加目标"
            className="h-7 w-28 rounded-full text-xs"
          />
          <Button
            size="xs"
            variant="pinksoft"
            onClick={() => {
              if (!text.trim()) return;
              addGoal(weekId, text.trim());
              setText("");
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
