"use client";

import React from "react";

type Block = { start: number; end: number; label: string; type: "shift" | "break" };

const WEEKDAY_BLOCKS: Block[] = [
  { start: 8, end: 10, label: "On Queue", type: "shift" },
  { start: 10, end: 10.25, label: "Break", type: "break" },
  { start: 10.25, end: 12, label: "On Queue", type: "shift" },
  { start: 12, end: 12.5, label: "Lunch", type: "break" },
  { start: 12.5, end: 14.5, label: "On Queue", type: "shift" },
  { start: 14.5, end: 14.75, label: "Break", type: "break" },
  { start: 14.75, end: 16, label: "On Queue", type: "shift" },
];

function formatHour(h: number) {
  const hour = Math.floor(h);
  const mins = Math.round((h - hour) * 60);
  const suffix = hour >= 12 ? "p" : "a";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return mins > 0 ? `${display}:${mins.toString().padStart(2, "0")}${suffix}` : `${display}${suffix}`;
}

function formatDuration(start: number, end: number) {
  const mins = Math.round((end - start) * 60);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

export default function Schedule({ id, title }: { id: string; title: string }) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  // Dynamic range based on actual shift
  const shiftStart = WEEKDAY_BLOCKS[0]?.start ?? 8;
  const shiftEnd = WEEKDAY_BLOCKS[WEEKDAY_BLOCKS.length - 1]?.end ?? 16;
  const totalHours = shiftEnd - shiftStart;
  const totalShift = formatDuration(0, totalHours);
  const unpaidBreakHours = WEEKDAY_BLOCKS.filter(b => b.label === "Lunch").reduce((sum, b) => sum + (b.end - b.start), 0);
  const paidHours = totalHours - unpaidBreakHours;
  const totalPaid = formatDuration(0, paidHours);

  function hourToPercent(h: number) {
    return ((h - shiftStart) / totalHours) * 100;
  }

  return (
    <div>
      <div className="text-sm font-bold">SCHEDULE</div>
      <hr className="my-2 module-divider-inline" />

      <div className="flex justify-between text-xs mb-4">
        <div>
          <div className="text-foreground/60 text-[10px] uppercase tracking-wide">Shift</div>
          <div className="font-semibold">{formatHour(shiftStart)} – {formatHour(shiftEnd)}</div>
        </div>
        <div className="text-right">
          <div className="text-foreground/60 text-[10px] uppercase tracking-wide">Duration</div>
          <div className="font-semibold">{totalShift}</div>
        </div>
      </div>

      <svg className="w-full h-10 mb-1" preserveAspectRatio="none">
        <defs>
          <pattern id="scheduleStripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <rect width="4" height="4" fill="var(--background)" />
            <path d="M0 0 L0 4" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="square" />
          </pattern>
        </defs>
        {WEEKDAY_BLOCKS.map((b, i) => {
          const left = hourToPercent(b.start);
          const width = hourToPercent(b.end) - left;
          const isBreak = b.type === "break";
          const isHovered = hoveredIdx === i;
          const isOtherHovered = hoveredIdx !== null && !isHovered;
          return (
            <g key={i}>
              {/* Base layer: solid fill */}
              <rect
                x={`${left}%`}
                width={`${width}%`}
                y="1"
                height="calc(100% - 2px)"
                fill={isBreak ? "var(--background)" : "var(--foreground)"}
                stroke="var(--foreground)"
                strokeWidth="1"
              />
              {/* Stripe overlay - fades in when other block is hovered (only for shift blocks) */}
              {!isBreak && (
                <rect
                  x={`${left}%`}
                  width={`${width}%`}
                  y="1"
                  height="calc(100% - 2px)"
                  fill="url(#scheduleStripes)"
                  stroke="var(--foreground)"
                  strokeWidth="1"
                  style={{ 
                    opacity: isOtherHovered ? 1 : 0,
                    transition: "opacity 200ms ease"
                  }}
                  pointerEvents="none"
                />
              )}
              {/* Hover fill for breaks - solid foreground on hover */}
              {isBreak && (
                <rect
                  x={`${left}%`}
                  width={`${width}%`}
                  y="1"
                  height="calc(100% - 2px)"
                  fill="var(--foreground)"
                  stroke="var(--foreground)"
                  strokeWidth="1"
                  style={{ 
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 200ms ease"
                  }}
                  pointerEvents="none"
                />
              )}
              {/* Invisible hit area */}
              <rect
                x={`${left}%`}
                width={`${width}%`}
                y="1"
                height="calc(100% - 2px)"
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}
      </svg>

      <div className="flex justify-between text-[9px] text-foreground/50 mb-3">
        <span>{formatHour(shiftStart)}</span>
        <span>{formatHour((shiftStart + shiftEnd) / 2)}</span>
        <span>{formatHour(shiftEnd)}</span>
      </div>

      <div className="min-h-[20px] text-xs">
        {hoveredIdx !== null ? (
          <div className="flex justify-between items-center">
            <span className="font-medium">{WEEKDAY_BLOCKS[hoveredIdx].label}</span>
            <span className="text-foreground/70">
              {formatHour(WEEKDAY_BLOCKS[hoveredIdx].start)} – {formatHour(WEEKDAY_BLOCKS[hoveredIdx].end)}
              <span className="ml-2 text-foreground/50">({formatDuration(WEEKDAY_BLOCKS[hoveredIdx].start, WEEKDAY_BLOCKS[hoveredIdx].end)})</span>
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-foreground/60">
            <span>Total</span>
            <span>{totalPaid}</span>
          </div>
        )}
      </div>
    </div>
  );
}


