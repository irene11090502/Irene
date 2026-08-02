"use client";

import * as React from "react";
import { BookOpen, Image as ImageIcon, Type } from "lucide-react";
import { useStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/common/ImageUpload";

type Kind = "vocab" | "grammar";

function StudyBlockEditor({
  weekId,
  date,
  kind,
  title,
  value,
}: {
  weekId: string;
  date: string;
  kind: Kind;
  title: string;
  value: { text: string; images: string[] };
}) {
  const setStudyText = useStore((s) => s.setStudyText);
  const addStudyImage = useStore((s) => s.addStudyImage);
  const deleteStudyImage = useStore((s) => s.deleteStudyImage);

  return (
    <div className="rounded-lg bg-pink-50/50 p-2">
      <div className="mb-1.5 flex items-center gap-1 text-[12px] font-semibold text-pink-700">
        <BookOpen className="h-3.5 w-3.5" /> {title}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-1.5">
          <Type className="mt-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <Textarea
            value={value.text}
            onChange={(e) => setStudyText(weekId, date, kind, e.target.value)}
            placeholder="打字文稿 / 文档内容，随手记录…"
            className="min-h-[64px] text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <span className="text-[11px] text-muted-foreground">图片上传</span>
        </div>
        <ImageUpload
          images={value.images}
          onAdd={(img) => addStudyImage(weekId, date, kind, img)}
          onRemove={(idx) => deleteStudyImage(weekId, date, kind, idx)}
        />
      </div>
    </div>
  );
}

export function StudyModule({
  weekId,
  day,
}: {
  weekId: string;
  day: { date: string; vocab: { text: string; images: string[] }; grammar: { text: string; images: string[] } };
}) {
  return (
    <div className="space-y-3">
      <StudyBlockEditor
        weekId={weekId}
        date={day.date}
        kind="vocab"
        title="生词"
        value={day.vocab}
      />
      <StudyBlockEditor
        weekId={weekId}
        date={day.date}
        kind="grammar"
        title="语法"
        value={day.grammar}
      />
    </div>
  );
}
