"use client";

import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    function onMouseMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
    }

    function onMouseDown() {
      setClicking(true);
    }

    function onMouseUp() {
      setClicking(false);
    }

    function onDragEnd() {
      setClicking(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("dragend", onDragEnd);
    window.addEventListener("drop", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("dragend", onDragEnd);
      window.removeEventListener("drop", onMouseUp);
    };
  }, []);

  if (!mounted) return null;

  const size = clicking ? 12 : 20;

  return (
    <svg
      width={size}
      height={size}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 99999,
        transition: "width 0.15s ease, height 0.15s ease",
        overflow: "visible",
      }}
    >
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill="var(--foreground)" />
    </svg>
  );
}
