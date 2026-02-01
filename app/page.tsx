"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Schedule from "../components/modules/Schedule";
import Transcript from "../components/modules/Transcript";
import StatusSelector from "../components/modules/StatusSelector";
import KPIs from "../components/modules/KPIs";
import QueueOverview from "../components/modules/QueueOverview";
import QueueList from "../components/modules/QueueList";

type Module = {
  id: string;
  title: string;
  content?: string;
  component?: string;
};

const initialModules: Module[] = [
  { id: "m-0", title: "Schedule", content: "Shift schedule", component: "Schedule" },
  { id: "m-1", title: "Live Transcript", content: "Call transcript", component: "Transcript" },
  { id: "m-2", title: "Status", content: "Agent status", component: "StatusSelector" },
  { id: "m-3", title: "KPIs", content: "Key metrics", component: "KPIs" },
  { id: "m-4", title: "Queue", content: "Queue overview", component: "QueueOverview" },
  { id: "m-5", title: "Agents", content: "Agent list", component: "QueueList" },
];

const moduleComponents: Record<string, React.FC<any>> = {
  Schedule,
  Transcript,
  StatusSelector,
  KPIs,
  QueueOverview,
  QueueList,
};

function ModuleCard({
  module,
  ModuleComponent,
  setRef,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  module: Module;
  ModuleComponent: React.FC<any> | null;
  setRef: (el: HTMLElement | null) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
}) {
  return (
        <div
      ref={(el) => setRef(el)}
      draggable
      onDragStart={(e) => onDragStart(e, module.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, module.id)}
          className="flex cursor-grab select-none flex-col justify-between overflow-visible p-4 shadow-sm module-card border"
      style={{ willChange: "transform" }}
    >
      {ModuleComponent ? <ModuleComponent id={module.id} title={module.title} /> : null}
    </div>
  );
}

export default function Home() {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [dragId, setDragId] = useState<string | null>(null);

  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});
  const prevRects = useRef<Record<string, DOMRect>>({});

  function captureRects() {
    const rects: Record<string, DOMRect> = {};
    modules.forEach((m) => {
      const el = nodeRefs.current[m.id];
      if (el) rects[m.id] = el.getBoundingClientRect();
    });
    prevRects.current = rects;
  }

  function runFLIPAnimation(oldRects: Record<string, DOMRect>) {
    Object.keys(nodeRefs.current).forEach((id) => {
      const el = nodeRefs.current[id];
      if (!el) return;
      const prev = oldRects[id];
      const next = el.getBoundingClientRect();
      if (!prev) return;
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (dx === 0 && dy === 0) return;
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.getBoundingClientRect();
      requestAnimationFrame(() => {
        el.style.transition = "transform 300ms cubic-bezier(.2,.8,.2,1)";
        el.style.transform = "";
      });
      const cleanup = () => {
        el.style.transition = "";
        el.style.transform = "";
        el.removeEventListener("transitionend", cleanup);
      };
      el.addEventListener("transitionend", cleanup);
    });
  }

  function onDragStart(e: React.DragEvent, id: string) {
    captureRects();
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function onDrop(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (!dragId || dragId === id) return;
    const fromIndex = modules.findIndex((m) => m.id === dragId);
    const toIndex = modules.findIndex((m) => m.id === id);
    if (fromIndex === -1 || toIndex === -1) return;
    const next = [...modules];
    // swap
    const tmp = next[fromIndex];
    next[fromIndex] = next[toIndex];
    next[toIndex] = tmp;
    const old = prevRects.current;
    setModules(next);
    setDragId(null);
    requestAnimationFrame(() => runFLIPAnimation(old));
  }

  useLayoutEffect(() => {
    // keep refs / layout stable
  }, [modules.length]);

  return (
    <div className="min-h-screen w-full p-6 flex items-center justify-center">
      <div className="w-full max-w-7xl">
        <div
          className="grid gap-4"
          style={{
            gridAutoRows: "minmax(110px, auto)",
            gridAutoFlow: "dense",
            gridTemplateColumns: "repeat(auto-fit, 320px)",
            justifyContent: "center",
          }}
        >
          {modules.map((m) => {
            const ModuleComponent = m.component ? moduleComponents[m.component] ?? null : null;
            return (
              <ModuleCard
                key={m.id}
                module={m}
                ModuleComponent={ModuleComponent}
                setRef={(el) => (nodeRefs.current[m.id] = el)}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
