"use client";

import * as React from "react";
import { Download, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Backup() {
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const payload = exportData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `personal-growth-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-importing same file
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || !Array.isArray(data.weeks)) {
          alert("文件格式不对：不是有效的备份文件。");
          return;
        }
        if (
          window.confirm(
            "导入会覆盖当前所有数据，确定继续吗？\n（建议先导出一份当前备份再导入）"
          )
        ) {
          importData(data);
          alert("导入成功 ✅ 数据已恢复。");
        }
      } catch {
        alert("读取失败：文件不是合法的 JSON。");
      }
    };
    reader.readAsText(file);
  };

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        className={btn}
        onClick={handleExport}
        title="导出备份（JSON 文件）"
        aria-label="导出备份"
      >
        <Download className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={cn(btn)}
        onClick={() => fileRef.current?.click()}
        title="导入备份（从 JSON 文件恢复）"
        aria-label="导入备份"
      >
        <Upload className="h-4 w-4" />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />
    </div>
  );
}
