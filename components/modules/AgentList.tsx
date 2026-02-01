"use client";

import React from "react";

type Queue = {
  id: string;
  name: string;
  waiting: number;
  aht: string; // average handle time
  abandoned: number;
  service: string; // percent
  totalCalls: number;
};

const QUEUES: Queue[] = [
  { id: "consumer", name: "Consumer", waiting: 4, aht: "00:04:32", abandoned: 1, service: "92%", totalCalls: 128 },
  { id: "premium", name: "Premium", waiting: 2, aht: "00:03:58", abandoned: 0, service: "95%", totalCalls: 84 },
  { id: "intermodal", name: "Intermodal", waiting: 6, aht: "00:05:10", abandoned: 2, service: "88%", totalCalls: 201 },
  { id: "international", name: "International", waiting: 3, aht: "00:06:12", abandoned: 1, service: "90%", totalCalls: 97 },
];

export default function AgentList({ id, title }: { id: string; title: string }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  const rowHeight = 44; // thinner rows
  const expandedMax = rowHeight + 120;

  function toggle(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <div>
      <div className="text-sm font-bold">ALL QUEUES</div>
      <hr className="my-2 module-divider-inline" />

      <div className="space-y-2">
        {QUEUES.map((q) => {
          const open = openId === q.id;
          // outer container holds the border and expands/collapses
          return (
            <div
              key={q.id}
              className="overflow-hidden border border-foreground bg-background"
              style={{ transition: 'max-height 180ms ease', maxHeight: open ? expandedMax : rowHeight }}
            >
              <div
                className="w-full flex items-stretch justify-between"
                role="button"
                tabIndex={0}
                onClick={() => toggle(q.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(q.id); }}
                style={{ height: rowHeight }}
              >
                <div className="px-3 flex-1 flex items-center">
                  <div className="text-sm font-medium">{q.name}</div>
                </div>

                <div className="h-full">
                  <div className="bg-foreground text-background flex items-center justify-center" style={{ width: 44, height: '100%', minHeight: rowHeight }}>
                    <span className="text-sm font-medium">{q.waiting}</span>
                  </div>
                </div>
              </div>

              {open ? (
                <div id={`queue-${q.id}-details`} role="region" aria-hidden={!open} className="px-3 py-3 border-t border-foreground">
                  <ul className="space-y-2">
                    <li className="flex justify-between text-xs">
                      <span className="text-foreground/80">Total calls</span>
                      <span className="font-medium">{q.totalCalls}</span>
                    </li>
                    <li className="flex justify-between text-xs">
                      <span className="text-foreground/80">AHT (day)</span>
                      <span className="font-medium">{q.aht}</span>
                    </li>
                    <li className="flex justify-between text-xs">
                      <span className="text-foreground/80">Abandoned</span>
                      <span className="font-medium">{q.abandoned}</span>
                    </li>
                    <li className="flex justify-between text-xs">
                      <span className="text-foreground/80">Service %</span>
                      <span className="font-medium">{q.service}</span>
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
