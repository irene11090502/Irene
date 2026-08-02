"use client";

import * as React from "react";
import { BookMarked, Check, Plus, Trash2, PenLine, Image as ImageIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { ImageUpload } from "@/components/common/ImageUpload";
import { cn } from "@/lib/utils";

export function ReadingModule({
  weekId,
  day,
}: {
  weekId: string;
  day: any;
}) {
  const addReading = useStore((s) => s.addReading);
  const deleteReading = useStore((s) => s.deleteReading);
  const addNote = useStore((s) => s.addNote);
  const updateNote = useStore((s) => s.updateNote);
  const deleteNote = useStore((s) => s.deleteNote);
  const addTranscription = useStore((s) => s.addTranscription);
  const deleteTranscription = useStore((s) => s.deleteTranscription);

  const [book, setBook] = React.useState("");
  const [minutes, setMinutes] = React.useState("");

  const submitReading = () => {
    if (!book.trim()) return;
    addReading(
      weekId,
      day.date,
      book.trim(),
      Number(minutes) || 0
    );
    setBook(""); setMinutes("");
  };

  return (
    <div className="space-y-3">
      {/* 阅读记录 */}
      <div className="rounded-lg bg-pink-50/50 p-2">
        <div className="mb-1.5 flex items-center gap-1 text-[12px] font-semibold text-pink-700">
          <BookMarked className="h-3.5 w-3.5" /> 阅读记录
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Input
            value={book}
            onChange={(e) => setBook(e.target.value)}
            placeholder="书名"
            className="h-8 min-w-[90px] flex-1 text-xs"
          />
          <Input
            value={minutes}
            onChange={(e) => setMinutes(e.target.value.replace(/\D/g, ""))}
            placeholder="分钟"
            className="h-8 w-16 text-xs"
          />
          <Button size="sm" className="h-8 px-2.5" onClick={submitReading}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <ul className="mt-1.5 space-y-1">
          {day.reading.map((r: any) => (
            <li
              key={r.id}
              className="group flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs"
            >
              <span className="font-medium">{r.book}</span>
              <span className="text-muted-foreground">
                {r.minutes} 分钟
              </span>
              <button
                onClick={() => deleteReading(weekId, day.date, r.id)}
                className="ml-auto hidden text-muted-foreground hover:text-rose-500 group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          {day.reading.length === 0 && (
            <p className="px-1 text-[11px] text-muted-foreground">还没有阅读记录</p>
          )}
        </ul>
      </div>

      {/* 读书笔记 */}
      <div className="rounded-lg bg-pink-50/50 p-2">
        <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold text-pink-700">
          <span className="flex items-center gap-1">
            <PenLine className="h-3.5 w-3.5" /> 读书笔记
          </span>
          <button
            onClick={() => addNote(weekId, day.date)}
            className="rounded-md bg-white px-1.5 py-0.5 text-[11px] text-pink-600 hover:bg-pink-100"
          >
            + 新增笔记
          </button>
        </div>
        <div className="space-y-2">
          {day.notes.map((n: any) => (
            <div key={n.id} className="relative">
              <button
                onClick={() => deleteNote(weekId, day.date, n.id)}
                className="absolute right-1 top-1 z-10 rounded p-0.5 text-muted-foreground hover:text-rose-500"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <RichTextEditor
                value={n.content}
                onChange={(html) => updateNote(weekId, day.date, n.id, html)}
                placeholder="记录你的读书感悟…"
              />
            </div>
          ))}
          {day.notes.length === 0 && (
            <p className="px-1 text-[11px] text-muted-foreground">点击右上角新增一篇笔记</p>
          )}
        </div>
      </div>

      {/* 摘抄练字 */}
      <div className="rounded-lg bg-pink-50/50 p-2">
        <div className="mb-1.5 flex items-center gap-1 text-[12px] font-semibold text-pink-700">
          <ImageIcon className="h-3.5 w-3.5" /> 摘抄练字
        </div>
        <ImageUpload
          images={day.transcriptions.map((t: any) => t.image)}
          onAdd={(img) => addTranscription(weekId, day.date, img)}
          onRemove={(idx) =>
            deleteTranscription(weekId, day.date, day.transcriptions[idx].id)
          }
        />
      </div>
    </div>
  );
}
