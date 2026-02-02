"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Schedule from "../components/modules/Schedule";
import Transcript from "../components/modules/Transcript";
import StatusSelector from "../components/modules/StatusSelector";
import KPIs from "../components/modules/KPIs";
import QueueOverview from "../components/modules/QueueOverview";
import QueueList from "../components/modules/QueueList";

function TimePill() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "14px",
        left: "24px",
        padding: "4px 12px",
        borderRadius: "999px",
        background: "var(--foreground)",
        color: "var(--background)",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.05em",
        zIndex: 1000,
      }}
    >
      {time}
    </div>
  );
}

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
      style={{ willChange: "transform", width: "320px" }}
    >
      {ModuleComponent ? <ModuleComponent id={module.id} title={module.title} /> : null}
    </div>
  );
}

const STORAGE_KEY = "oncall-module-order";

export default function Home() {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [dragId, setDragId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});
  const prevRects = useRef<Record<string, DOMRect>>({});

  // Load saved order from localStorage after hydration
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedIds: string[] = JSON.parse(saved);
        const ordered = savedIds
          .map((id) => initialModules.find((m) => m.id === id))
          .filter((m): m is Module => m !== undefined);
        const remaining = initialModules.filter((m) => !savedIds.includes(m.id));
        setModules([...ordered, ...remaining]);
      } catch {
        // keep default
      }
    }
    setHydrated(true);
  }, []);

  // Save module order to localStorage whenever it changes (after hydration)
  React.useEffect(() => {
    if (!hydrated) return;
    const ids = modules.map((m) => m.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [modules, hydrated]);

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

  const masonryBreakpoints = {
    default: 3,
    1000: 2,
    680: 1,
  };

  return (
    <div className="min-h-screen w-full p-6 pt-16 flex items-center justify-center overflow-x-auto">
      <TimePill />
      <div style={{ width: "fit-content" }}>
        <Masonry
          breakpointCols={masonryBreakpoints}
          className="masonry-grid"
          columnClassName="masonry-column"
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
        </Masonry>
      </div>
    </div>
  );
}
