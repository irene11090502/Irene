"use client";

import * as React from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Minimal rich text editor built on contentEditable.
 * Supports bold / italic / underline / bullet / ordered lists.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "写点什么…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string) => {
    document.execCommand(cmd, false);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const tools = [
    { icon: Bold, cmd: "bold", label: "加粗" },
    { icon: Italic, cmd: "italic", label: "斜体" },
    { icon: Underline, cmd: "underline", label: "下划线" },
    { icon: List, cmd: "insertUnorderedList", label: "无序列表" },
    { icon: ListOrdered, cmd: "insertOrderedList", label: "有序列表" },
  ];

  return (
    <div className="rounded-xl border border-input bg-card">
      <div className="flex items-center gap-0.5 border-b border-border px-2 py-1">
        {tools.map((t) => (
          <button
            key={t.cmd}
            type="button"
            title={t.label}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(t.cmd);
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <t.icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className={cn(
          "min-h-[90px] px-3 py-2 text-sm leading-relaxed text-foreground",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        )}
      />
    </div>
  );
}
