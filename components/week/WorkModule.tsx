"use client";

import * as React from "react";
import { Briefcase, Check, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkType } from "@/lib/types";

const WORK_TYPES: WorkType[] = ["备课", "批改", "回复学生", "自定义"];

export function WorkModule({ weekId, day }: { weekId: string; day: any }) {
  const addWork = useStore((s) => s.addWork);
  const toggleWork = useStore((s) => s.toggleWork);
  const editWork = useStore((s) => s.editWork);
  const deleteWork = useStore((s) => s.deleteWork);

  const [type, setType] = React.useState<WorkType>("备课");
  const [text, setText] = React.useState("");

  const submit = () => {
    if (!text.trim()) return;
    addWork(weekId, day.date, type, text.trim());
    setText("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as WorkType)}
          className="h-8 rounded-xl border border-input bg-card px-2 text-xs"
        >
          {WORK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="工作任务…"
          className="h-8 min-w-[100px] flex-1 text-xs"
        />
        <Button size="sm" className="h-8 px-2.5" onClick={submit}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ul className="space-y-1.5">
        {day.work.map((w: any) => (
          <li
            key={w.id}
            className="group flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1.5"
          >
            <button
              onClick={() => toggleWork(weekId, day.date, w.id)}
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                w.done
                  ? "border-pink-500 bg-pink-500 text-white"
                  : "border-muted-foreground/40"
              )}
            >
              {w.done && <Check className="h-2.5 w-2.5" />}
            </button>
            <span className="rounded bg-pink-100 px-1.5 text-[10px] font-medium text-pink-700">
              {w.type}
            </span>
            <span
              className={cn(
                "flex-1 text-xs",
                w.done && "text-muted-foreground line-through"
              )}
            >
              {w.text}
            </span>
            <button
              onClick={() => deleteWork(weekId, day.date, w.id)}
              className="hidden text-muted-foreground hover:text-rose-500 group-hover:block"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
        {day.work.length === 0 && (
          <p className="px-1 text-[11px] text-muted-foreground">暂无工作任务</p>
        )}
      </ul>
    </div>
  );
}
