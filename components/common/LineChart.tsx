"use client";

import * as React from "react";

export interface LinePoint {
  label: string;
  value: number;
}

/** Lightweight SVG line chart with gradient area fill. */
export function LineChart({
  data,
  height = 120,
  color = "#e5578a",
  unit = "",
}: {
  data: LinePoint[];
  height?: number;
  color?: string;
  unit?: string;
}) {
  const width = 280;
  const padX = 8;
  const padY = 14;
  const max = Math.max(1, ...data.map((d) => d.value));
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const pts = data.map((d, i) => {
    const x = padX + (data.length === 1 ? innerW / 2 : (innerW * i) / (data.length - 1));
    const y = padY + innerH - (d.value / max) * innerH;
    return { x, y, ...d };
  });

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${padY + innerH} L${pts[0].x},${padY + innerH} Z`;

  const gid = React.useId();

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
      role="img"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill="#fff" stroke={color} strokeWidth={2} />
          <text
            x={p.x}
            y={height - 2}
            fontSize={9}
            textAnchor="middle"
            fill="#9aa0a6"
          >
            {p.label}
          </text>
          {p.value > 0 && (
            <text
              x={p.x}
              y={p.y - 7}
              fontSize={9}
              textAnchor="middle"
              fill="#e5578a"
              fontWeight={600}
            >
              {p.value}
              {unit}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
