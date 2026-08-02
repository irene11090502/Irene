"use client";

import * as React from "react";
import { NotebookPen, History } from "lucide-react";
import { useStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload, ImagePreview } from "@/components/common/ImageUpload";

export function DiaryModule({ weekId, day }: { weekId: string; day: any }) {
  const setDiaryContent = useStore((s) => s.setDiaryContent);
  const addDiaryImage = useStore((s) => s.addDiaryImage);
  const removeDiaryImage = useStore((s) => s.removeDiaryImage);

  const [preview, setPreview] = React.useState(-1);
  const images = day.diary?.images ?? [];

  return (
    <div className="space-y-2">
      <Textarea
        value={day.diary?.content ?? ""}
        onChange={(e) => setDiaryContent(weekId, day.date, e.target.value)}
        placeholder="写下今天的故事…"
        className="min-h-[80px] text-xs"
      />
      <ImageUpload
        images={images}
        onAdd={(img) => addDiaryImage(weekId, day.date, img)}
        onRemove={(idx) => removeDiaryImage(weekId, day.date, idx)}
        label="上传日记图片"
      />
      {images.length > 0 && (
        <button
          onClick={() => setPreview(0)}
          className="flex items-center gap-1 text-[11px] text-pink-600 hover:underline"
        >
          <History className="h-3 w-3" /> 查看 {images.length} 张图片
        </button>
      )}
      <ImagePreview
        images={images}
        index={preview}
        onClose={() => setPreview(-1)}
      />
    </div>
  );
}
