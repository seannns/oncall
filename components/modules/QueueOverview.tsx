import React from "react";

export default function QueueOverview({ id, title, userData }: { id: string; title: string; userData?: number[] }) {
  // Placeholder hourly data (8am - 5pm)
  const hours = ["8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm"];
  const data = [12, 8, 3, 14, 20, 16, 10, 18, 22, 15];

  const max = Math.max(...data);
  // userData prop: number of calls the user handled each hour. If not provided, show a demo 30% of total.
  const userDataFinal: number[] =
    userData && userData.length === data.length
      ? userData
      : data.map((v) => Math.max(0, Math.round(v * 0.3)));
  // visual sizing for SVG - larger bars and spacing
  const barWidth = 46;
  const gap = 4;
  // Use a larger viewBox so bars can scale up to a max visual height (400px)
  const svgHeight = 400;
  const viewBoxWidth = hours.length * (barWidth + gap) + 16;
  const [hovered, setHovered] = React.useState<number | null>(null);
  return (
    <div className="queue">
      <div className="text-sm font-bold">QUEUE</div>
      <hr className="my-2 module-divider-inline" />

      {/* Make the chart area a fixed min-height so the SVG can fill it and align to bottom */}
      <div className="mt-2 queue-chart-container flex items-end">
        <svg
          className="queue-svg"
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <pattern id="diagStripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <rect width="8" height="8" fill="transparent" />
              <path d="M0 0 L0 8" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="square" />
            </pattern>
          </defs>
          {/* styling moved to app/globals.css (.queue .bar-value, .queue .user-overlay:hover ~ .bar-value) */}
          {/* bars */}
          {data.map((v, i) => {
            // tighten vertical spacing: baseline closer to bottom and labels just below bars
            const baseline = svgHeight - 40; // baseline for bars (less padding)
            const labelY = baseline + 18; // position for hour labels (just below baseline)
            const maxBarHeight = baseline - 20; // leave small top padding
            const x = i * (barWidth + gap) + 8;
            const h = (v / max) * maxBarHeight;
            const y = baseline - h;
            const userV = userDataFinal[i] ?? 0;
            const userH = (userV / max) * maxBarHeight;
            const userY = baseline - userH;
            return (
              <g className="bar-group" key={i}>
                {/* total bar: diagonal stripes (non-interactive) */}
                <rect x={x} y={y} width={barWidth} height={h} fill="url(#diagStripes)" pointerEvents="none" />
                {/* overlay: user's portion as solid fill (interactive) */}
                <rect
                  className="user-overlay"
                  x={x}
                  y={userY}
                  width={barWidth}
                  height={userH}
                  fill="var(--foreground)"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
                {/* hover value (user's calls) - always in DOM so CSS can animate; visibility controlled via class */}
                <text
                  className={`bar-value ${hovered === i ? 'visible' : ''}`}
                  x={x + barWidth / 2}
                  y={userY + 22}
                  fontSize={18}
                  fill="var(--background)"
                  textAnchor="middle"
                >
                  {userV}
                </text>
                {/* hour label */}
                <text x={x + barWidth / 2} y={labelY} fontSize={16} fill="var(--foreground)" textAnchor="middle">{hours[i].toUpperCase()}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* legend */}
      <div className="queue-legend">
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <defs>
              <pattern id="legendDiag" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                <rect width="4" height="4" fill="transparent" />
                <path d="M0 0 L0 4" stroke="var(--foreground)" strokeWidth="1" strokeLinecap="square" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="12" height="12" fill="url(#legendDiag)" stroke="var(--foreground)" strokeWidth="1" />
          </svg>
          <div>TOTAL</div>
        </div>

        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <rect x="0" y="0" width="12" height="12" fill="var(--foreground)" stroke="var(--foreground)" strokeWidth="1" />
          </svg>
          <div>USER</div>
        </div>
      </div>
    </div>
  );
}
