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

export default function QueueList({ id, title }: { id: string; title: string }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <div>
      <div className="text-sm font-bold">ALL QUEUES</div>
      <hr className="my-2 module-divider-inline" />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {QUEUES.map((q, idx) => {
          const isOpen = openId === q.id;
          return (
            <div key={q.id}>
              <button
                onClick={() => toggle(q.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  border: "1px solid var(--foreground)",
                  borderTop: idx === 0 ? "1px solid var(--foreground)" : "none",
                  background: "var(--background)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "2px" }}>
                    {q.name.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    {q.waiting} call{q.waiting !== 1 ? "s" : ""} waiting...
                  </div>
                </div>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 200ms ease",
                  }}
                >
                  ›
                </div>
              </button>
              <div
                style={{
                  maxHeight: isOpen ? "150px" : "0px",
                  opacity: isOpen ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 200ms ease, opacity 200ms ease",
                  borderLeft: "1px solid var(--foreground)",
                  borderRight: "1px solid var(--foreground)",
                  borderBottom: isOpen ? "1px solid var(--foreground)" : "none",
                }}
              >
                <div style={{ padding: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ opacity: 0.7 }}>Total calls</span>
                      <span style={{ fontWeight: 500 }}>{q.totalCalls}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ opacity: 0.7 }}>AHT (day)</span>
                      <span style={{ fontWeight: 500 }}>{q.aht}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ opacity: 0.7 }}>Abandoned</span>
                      <span style={{ fontWeight: 500 }}>{q.abandoned}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ opacity: 0.7 }}>Service %</span>
                      <span style={{ fontWeight: 500 }}>{q.service}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
