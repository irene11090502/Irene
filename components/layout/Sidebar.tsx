"use client";

import * as React from "react";
import { CalendarDays, Plus, Pencil, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { startOfWeekMonday, todayISO, weekLabel } from "@/lib/date";

export function Sidebar() {
  const weeks = useStore((s) => s.weeks);
  const selectedWeekId = useStore((s) => s.selectedWeekId);
  const selectWeek = useStore((s) => s.selectWeek);
  const createWeek = useStore((s) => s.createWeek);
  const deleteWeek = useStore((s) => s.deleteWeek);
  const renameWeek = useStore((s) => s.renameWeek);

  const [newOpen, setNewOpen] = React.useState(false);
  const [newDate, setNewDate] = React.useState(startOfWeekMonday(todayISO()));
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [delId, setDelId] = React.useState<string | null>(null);

  // group by year
  const grouped = React.useMemo(() => {
    const map = new Map<number, typeof weeks>();
    weeks.forEach((w) => {
      if (!map.has(w.year)) map.set(w.year, []);
      map.get(w.year)!.push(w);
    });
    return Array.from(map.entries());
  }, [weeks]);

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-card/60">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-pink-500" />
          <span className="text-sm font-semibold">周计划</span>
        </div>
        <Button size="icon" variant="pinksoft" onClick={() => setNewOpen(true)} title="新建周计划">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
        {grouped.map(([year, list]) => (
          <div key={year}>
            <div className="px-1 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {year}
            </div>
            <ul className="space-y-1">
              {list.map((w) => (
                <li key={w.id}>
                  <div
                    onClick={() => selectWeek(w.id)}
                    className={cn(
                      "group flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition-colors",
                      selectedWeekId === w.id
                        ? "bg-pink-100 text-pink-700"
                        : "hover:bg-accent/60"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium">
                        {w.name}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {w.label}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditId(w.id);
                        setEditName(w.name);
                      }}
                      className="hidden text-muted-foreground hover:text-foreground group-hover:block"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDelId(w.id);
                      }}
                      className="hidden text-muted-foreground hover:text-rose-500 group-hover:block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* New week modal */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="新建周计划">
        <div className="space-y-2.5">
          <label className="block text-xs text-muted-foreground">
            选择本周周一日期
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mt-1"
            />
          </label>
          <p className="text-[11px] text-muted-foreground">
            将自动生成为期 7 天的周计划（{newDate ? weekLabel(startOfWeekMonday(newDate)) : ""}）
          </p>
          <Button
            className="w-full"
            onClick={() => {
              if (!newDate) return;
              createWeek(newDate);
              setNewOpen(false);
            }}
          >
            创建
          </Button>
        </div>
      </Modal>

      {/* Rename modal */}
      <Modal open={!!editId} onClose={() => setEditId(null)} title="重命名周计划">
        <div className="space-y-2.5">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
          />
          <Button
            className="w-full"
            onClick={() => {
              if (editId && editName.trim()) renameWeek(editId, editName.trim());
              setEditId(null);
            }}
          >
            保存
          </Button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="删除周计划">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            确定要删除这个周计划吗？该周的所有数据将被移除，且无法恢复。
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDelId(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                if (delId) deleteWeek(delId);
                setDelId(null);
              }}
            >
              删除
            </Button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
