"use client";

import * as React from "react";
import { GripVertical, Plus, Trash2, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Priority, Todo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PRIORITY_BAR: Record<Priority, string> = {
  low: "bg-slate-300",
  medium: "bg-amber-400",
  high: "bg-rose-400",
};

const PRIORITY_NEXT: Record<Priority, Priority> = {
  low: "medium",
  medium: "high",
  high: "low",
};

export function TodoList({ weekId, day }: { weekId: string; day: { date: string; todos: Todo[] } }) {
  const addTodo = useStore((s) => s.addTodo);
  const toggleTodo = useStore((s) => s.toggleTodo);
  const editTodo = useStore((s) => s.editTodo);
  const deleteTodo = useStore((s) => s.deleteTodo);
  const setTodoPriority = useStore((s) => s.setTodoPriority);
  const setTodosOrder = useStore((s) => s.setTodosOrder);

  const [text, setText] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    addTodo(weekId, day.date, t, "medium");
    setText("");
  };

  const handleDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null);
      return;
    }
    const arr = [...day.todos];
    const [moved] = arr.splice(dragIndex, 1);
    arr.splice(target, 0, moved);
    setTodosOrder(weekId, day.date, arr);
    setDragIndex(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="添加任务…"
          className="h-8 text-xs"
        />
        <Button size="sm" onClick={submit} className="h-8 px-2.5">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ul className="space-y-1.5">
        {day.todos.map((todo, i) => (
          <li
            key={todo.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className={cn(
              "group flex items-center gap-1.5 rounded-lg border border-border bg-white px-1.5 py-1.5",
              dragIndex === i && "opacity-50"
            )}
          >
            <GripVertical className="h-3.5 w-3.5 cursor-grab text-muted-foreground/50" />
            <button
              onClick={() => setTodoPriority(weekId, day.date, todo.id, PRIORITY_NEXT[todo.priority])}
              title={`优先级：${todo.priority}`}
              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", PRIORITY_BAR[todo.priority])}
            />
            <button
              onClick={() => toggleTodo(weekId, day.date, todo.id)}
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                todo.done
                  ? "border-pink-500 bg-pink-500 text-white"
                  : "border-muted-foreground/40"
              )}
            >
              {todo.done && <Check className="h-2.5 w-2.5" />}
            </button>

            {editingId === todo.id ? (
              <input
                autoFocus
                defaultValue={todo.text}
                onBlur={(e) => {
                  editTodo(weekId, day.date, todo.id, e.target.value.trim() || todo.text);
                  setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
                className="flex-1 bg-transparent text-xs outline-none"
              />
            ) : (
              <span
                onDoubleClick={() => setEditingId(todo.id)}
                className={cn(
                  "flex-1 cursor-text text-xs",
                  todo.done && "text-muted-foreground line-through"
                )}
              >
                {todo.text}
              </span>
            )}

            <button
              onClick={() => deleteTodo(weekId, day.date, todo.id)}
              className="hidden text-muted-foreground hover:text-rose-500 group-hover:block"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
        {day.todos.length === 0 && (
          <p className="px-1 text-[11px] text-muted-foreground">还没有任务，添加一个吧 ✨</p>
        )}
      </ul>
    </div>
  );
}
